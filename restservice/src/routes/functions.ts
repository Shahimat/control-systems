import { pool } from './pool';

export function getInsertQuery (oValue: any, sTable: string): string {
    let names: string = '';
    let values: string = '';
    for (let key in oValue) {
        if (oValue[key] != undefined && oValue[key] != null) {
            if (oValue[key][0] == '@') {
                oValue[key] = oValue[key].slice(1).replace(/(\d+).(\d+).(\d+)/g,'$3-$2-$1');
            }
            names  += `${key},`;
            values += `'${oValue[key]}',`;
        }
    }
    return `INSERT INTO ${sTable} (${
        names.slice(0,names.length - 1)
    }) VALUES (${
        values.slice(0,values.length - 1)
    });`;
}

// Функция проверяет, все-ли поля из объекта oValue существуют
export function checkQuery (oValue: any, aFields: string[]): boolean {
    return !aFields.some(key => !oValue[key]);
}

export async function findPosition (sTableName: string, sSelectedFields: string[] = undefined, 
        sValue1: string = undefined, sValue2: string = undefined) {
    if (!sTableName || sValue1 == undefined && !sValue2 == undefined || !sValue1 == undefined && sValue2 == undefined) {
        throw 'ERROR: ENTER TABLE NAME & PARAMETERS';
    }
    let query: string = '';
    if (sSelectedFields && sSelectedFields.length != 0) {
        query += `SELECT ${sSelectedFields.join(',')} `;
    } else {
        query += `SELECT * `;
    }
    query += `FROM ${sTableName} `;
    query += sValue1 && sValue2? `WHERE ${sValue1} = ${sValue2};`: ';';
    console.log(query);
    return await pool.query(query);
}