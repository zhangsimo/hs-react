const getCity = (type, params) => {
    const get = {
        'province': function () {
            const provinceData = params.data.filter(f => f.province === params.id);
            if (provinceData.length === 0) {
                provinceData.push(params.column)
            }
            return provinceData
        },
        'city': function () {
            return params.data.filter(f => f.city === params.id && f.province === params.currentProvinceId);
        },
        'town': function () {
            return params.data.filter(f => f.area === params.id && f.province === params.currentProvinceId && f.city === params.currentCityId);
        },
        'default': function () {
            return []
        }
    };
    return (get[type] || get['default'])();
}
/* 省市区公用方法 */
export const region = (params) => {
    const cityData = getCity(params.type, params);
    return cityData
}
/* 手机号隐藏 */
export function concealPhone(tel) {
    return tel.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/*手机号码校验*/
export function checkMobile(tel) {
    return (/^1[3456789]\d{9}$/.test(tel)) ? true : false
}

/* 数组日期转换*/
export function formatDate(data) {
    for (let key in data) {
        if (data[key] < 10) {
            data[key] = '0' + data[key]
        }
    }
    return data.filter((f, i) => i < 3).join('-') + "  " + data.slice(3, 6).join(': ')
}


