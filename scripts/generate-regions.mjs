import { parse } from "csv-parse/sync";
import { readFile, writeFile } from "fs/promises";

const PATHS = {
    districtsJson: "./data/korea_districts.json",
    districtsCodeCsv: "./data/korea_districts_code.csv",
    geoSidoCsv: "./data/geo-sido.csv",
    geoSigCsv: "./data/geo-sig.csv",
    geoEmdCsv: "./data/geo-emd.csv",
    outputJson: "./src/entities/region/server/regions-full.generated.json",
};

const CSV_PARSE_OPTIONS = {
    from_line: 2,
    skip_empty_lines: true,
    trim: true,
};

const splitAddress = (addressText) => {
    const parts = addressText.split("-");
    // "전북특별자치도-전주시완산구-중앙동1가" -> ["전북특별자치도", "전주시", "완산구", "중앙동1가"] 별도 처리
    if (parts[1] && parts[1].includes("시") && parts[1].includes("구") && parts[1].indexOf("시") < parts[1].indexOf("구")) {
        const indexOfSi = parts[1].indexOf("시");
        parts.splice(1, 1, parts[1].slice(0, indexOfSi + 1), parts[1].slice(indexOfSi + 1));
    }
    return parts;
};

const parseSimpleCsv = (text) => parse(text, CSV_PARSE_OPTIONS);

const parseCodeCsv = (text) =>
    parse(text, {
        ...CSV_PARSE_OPTIONS,
        on_record: (record) => {
            const [code, name, rest] = record.slice(0, -3);
            return [code, name, ...rest.split(" ")];
        },
    }); // ["4111100000","장안구","경기도 수원시 장안구","구지역","Y","시군구"] -> ["4111100000","장안구","경기도","수원시","장안구"]

const normalizeQuery = (addressArr) => {
    const last = addressArr.at(-1);
    return last === "세종시" ? "세종특별자치시" : last; // "세종시" 별도 처리
};

const findCodeLine = (codeLines, query, addressArr) =>
    codeLines.find((line) => query === line[1] && addressArr.includes(line.at(-1)));

const getCoordinates = (code, geoSidoLines, geoSigLines, geoEmdLines) => {
    // 코드가 00000000으로 끝나면 시도단위에서 좌표 추출
    // 코드가 00000으로 끝나면 시구단위에서 좌표 추출
    // 그렇지 않으면 읍면동단위에서 좌표 추출(리단위는 제외)
    if (code.endsWith("00000000")) {
        const targetLineSido = geoSidoLines.find((line) => line[1] === code.slice(0, 2));
        return { lon: targetLineSido[3], lat: targetLineSido[4] };
    }
    if (code.endsWith("00000")) {
        const targetLineSig = geoSigLines.find((line) => line[2] === code.slice(0, 5));
        return { lon: targetLineSig[6], lat: targetLineSig[7] };
    }
    const targetLineEmd = geoEmdLines.find((line) => line[2] === code.slice(0, 8));
    return { lon: targetLineEmd[6], lat: targetLineEmd[7] };
};

const createRegionRecord = (addressArr, index, codeLines, geoSidoLines, geoSigLines, geoEmdLines) => {
    const query = normalizeQuery(addressArr);
    const codeLine = findCodeLine(codeLines, query, addressArr);
    const code = codeLine?.[0] ?? null;

    let lon = null;
    let lat = null;

    try {
        if (!code) {
            throw new Error("region code not found");
        }
        ({ lon, lat } = getCoordinates(code, geoSidoLines, geoSigLines, geoEmdLines));
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "unknown error",
            addressArr,
            code,
            id: index + 1,
            regionName: addressArr.join(" "),
            regionParts: addressArr,
            regionCode: code,
            lon,
            lat,
        };
    }

    return {
        id: index + 1,
        regionName: addressArr.join(" "),
        regionParts: addressArr,
        regionCode: code,
        lon,
        lat,
    };
};

const stringArrays = JSON.parse(await readFile(PATHS.districtsJson, "utf-8"));
const addresses = stringArrays.map(splitAddress);

const codeText = await readFile(PATHS.districtsCodeCsv, "utf-8");
const codeLines = parseCodeCsv(codeText);

const geoSidoLines = parseSimpleCsv(await readFile(PATHS.geoSidoCsv, "utf-8"));
const geoSigLines = parseSimpleCsv(await readFile(PATHS.geoSigCsv, "utf-8"));
const geoEmdLines = parseSimpleCsv(await readFile(PATHS.geoEmdCsv, "utf-8"));

const parsed = [];
let errCount = 0;
const isDebug = process.env.DEBUG_REGIONS === "1";

addresses.forEach((addressArr, index) => {
    const record = createRegionRecord(addressArr, index, codeLines, geoSidoLines, geoSigLines, geoEmdLines);
    if ("error" in record) {
        errCount += 1;
        if (isDebug) {
            console.log("regions:error", record.addressArr, record.regionCode, record.error);
        }
    } else {
        parsed.push(record);
    }
});

if (isDebug) {
    console.log("regions:errors", errCount);
}

if (errCount > 0) {
    throw new Error(`Region generation failed with ${errCount} errors`);
}

await writeFile(PATHS.outputJson, JSON.stringify(parsed, null, 2), "utf-8");