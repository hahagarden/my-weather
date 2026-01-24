import { parse } from "csv-parse/sync";
import { readFile, writeFile } from "fs/promises";

/* 
JSON 파일을 배열로 변환
*/
const stringArrays = JSON.parse(await readFile("./data/korea_districts.json", "utf-8"));
const addresses = stringArrays.map((str) => str.split("-"));

addresses.forEach((addressArr) => {
    // "전북특별자치도-전주시완산구-중앙동1가" -> ["전북특별자치도", "전주시", "완산구", "중앙동1가"] 별도 처리
    if (addressArr[1] && addressArr[1].includes("시") && addressArr[1].includes("구") && addressArr[1].indexOf("시") < addressArr[1].indexOf("구")) {
        const indexOfSi = addressArr[1].indexOf("시");
        addressArr.splice(1, 1, addressArr[1].slice(0, indexOfSi + 1), addressArr[1].slice(indexOfSi + 1));
    }

    return addressArr;
});

/*
CSV 파일을 배열로 변환
*/
const codeText = await readFile('./data/korea_districts_code.csv', 'utf-8');
const codeLines = parse(codeText, {
    from_line: 2,
    skip_empty_lines: true,
    trim: true,
    on_record: (record) => {
        const [code, name, rest] = record.slice(0, -3);
        return [code, name, ...rest.split(' ')];
    },
}); // ["4111100000","장안구","경기도 수원시 장안구","구지역","Y","시군구"] -> ["4111100000","장안구","경기도","수원시","장안구"]

const geoSidoText = await readFile('./data/geo-sido.csv','utf-8');
const geoSidoLines = parse(geoSidoText, {
    from_line: 2,
    skip_empty_lines: true,
    trim: true,
  });

const geoSigText = await readFile('./data/geo-sig.csv','utf-8');
const geoSigLines = parse(geoSigText, {
    from_line: 2,
    skip_empty_lines: true,
    trim: true,
  });

const geoEmdText = await readFile('./data/geo-emd.csv','utf-8');
const geoEmdLines = parse(geoEmdText, {
    from_line: 2,
    skip_empty_lines: true,
    trim: true,
  });

/*
데이터 조합
*/
let errCount = 0;

const parsed = addresses.map((addressArr, index) => {
    const query = addressArr.at(-1) === "세종시" ? "세종특별자치시" : addressArr.at(-1); // "세종시" 별도 처리

    const [code, ] = codeLines.find((line) => (query === line[1] ) && addressArr.includes(line.at(-1))); // 검색어 중복이 있을 경우 관할소로 구별
    let lon = null, lat = null;

    try {
        // 코드가 00000000으로 끝나면 시도단위에서 좌표 추출
        // 코드가 00000으로 끝나면 시구단위에서 좌표 추출
        // 그렇지 않으면 읍면동단위에서 좌표 추출(리단위는 제외)
        if (code.endsWith('00000000')) {
            const targetLineSido = geoSidoLines.find((line) => line[1] === code.slice(0, 2));
            lon = targetLineSido[3];
            lat = targetLineSido[4];
        } else if (code.endsWith('00000')) {
            const targetLineSig = geoSigLines.find((line) => line[2] === code.slice(0, 5));
            lon = targetLineSig[6];
            lat = targetLineSig[7];
        } else {
            const targetLineEmd = geoEmdLines.find((line) => line[2] === code.slice(0, 8));
            lon = targetLineEmd[6];
            lat = targetLineEmd[7];
        }
    } catch (error) {
        errCount++;
        console.error("========> error", addressArr, code, error);
    }

    return {
        id: index+1,
        regionName: addressArr.join(" "),
        regionParts: addressArr,
        regionCode: code,
        lon,
        lat,
    }
});

console.log("========> error count:", errCount);

await writeFile('./src/entities/region/server/regions-full.generated.json', JSON.stringify(parsed, null, 2), 'utf-8');