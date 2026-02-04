// 此文件由AI生成。如有错误，请手动修正
// This file was generated with AI assistance
// Please correct any errors manually

import { useState } from 'react'
import { Controller, Control } from 'react-hook-form'
import { Label } from '@/src/components/ui/label'
import { Badge } from '@/src/components/ui/badge'
import { Input } from '@/src/components/ui/input'
import { Switch } from '@/src/components/ui/switch'

interface CountrySectionProps {
    control: Control<Record<string, unknown> | any>
    fieldName: string
}

const POPULAR_COUNTRIES = [
    { code: 'CN', name: '中国' },
    { code: 'US', name: '美国' },
    { code: 'JP', name: '日本' },
    { code: 'KR', name: '韩国' },
    { code: 'HK', name: '香港' },
    { code: 'TW', name: '台湾' },
    { code: 'SG', name: '新加坡' },
    { code: 'GB', name: '英国' },
    { code: 'DE', name: '德国' },
    { code: 'FR', name: '法国' },
] as const

const ALL_COUNTRIES = [
    ...POPULAR_COUNTRIES,
    { code: 'AD', name: '安道尔' },
    { code: 'AE', name: '阿联酋' },
    { code: 'AF', name: '阿富汗' },
    { code: 'AG', name: '安提瓜和巴布达' },
    { code: 'AI', name: '安圭拉' },
    { code: 'AL', name: '阿尔巴尼亚' },
    { code: 'AM', name: '亚美尼亚' },
    { code: 'AO', name: '安哥拉' },
    { code: 'AQ', name: '南极洲' },
    { code: 'AR', name: '阿根廷' },
    { code: 'AS', name: '美属萨摩亚' },
    { code: 'AT', name: '奥地利' },
    { code: 'AU', name: '澳大利亚' },
    { code: 'AW', name: '阿鲁巴' },
    { code: 'AZ', name: '阿塞拜疆' },
    { code: 'BA', name: '波黑' },
    { code: 'BB', name: '巴巴多斯' },
    { code: 'BD', name: '孟加拉国' },
    { code: 'BE', name: '比利时' },
    { code: 'BF', name: '布基纳法索' },
    { code: 'BG', name: '保加利亚' },
    { code: 'BH', name: '巴林' },
    { code: 'BI', name: '布隆迪' },
    { code: 'BJ', name: '贝宁' },
    { code: 'BL', name: '法属圣巴泰勒米' },
    { code: 'BM', name: '百慕大' },
    { code: 'BN', name: '文莱' },
    { code: 'BO', name: '玻利维亚' },
    { code: 'BQ', name: '荷属加勒比区' },
    { code: 'BR', name: '巴西' },
    { code: 'BS', name: '巴哈马' },
    { code: 'BT', name: '不丹' },
    { code: 'BV', name: '布维岛' },
    { code: 'BW', name: '博茨瓦纳' },
    { code: 'BY', name: '白俄罗斯' },
    { code: 'BZ', name: '伯利兹' },
    { code: 'CA', name: '加拿大' },
    { code: 'CC', name: '科科斯（基林）群岛' },
    { code: 'CD', name: '刚果（金）' },
    { code: 'CF', name: '中非共和国' },
    { code: 'CG', name: '刚果（布）' },
    { code: 'CH', name: '瑞士' },
    { code: 'CI', name: '科特迪瓦' },
    { code: 'CK', name: '库克群岛' },
    { code: 'CL', name: '智利' },
    { code: 'CM', name: '喀麦隆' },
    { code: 'CO', name: '哥伦比亚' },
    { code: 'CR', name: '哥斯达黎加' },
    { code: 'CU', name: '古巴' },
    { code: 'CV', name: '佛得角' },
    { code: 'CW', name: '库拉索' },
    { code: 'CX', name: '圣诞岛' },
    { code: 'CY', name: '塞浦路斯' },
    { code: 'CZ', name: '捷克' },
    { code: 'DJ', name: '吉布提' },
    { code: 'DK', name: '丹麦' },
    { code: 'DM', name: '多米尼克' },
    { code: 'DO', name: '多米尼加' },
    { code: 'DZ', name: '阿尔及利亚' },
    { code: 'EC', name: '厄瓜多尔' },
    { code: 'EE', name: '爱沙尼亚' },
    { code: 'EG', name: '埃及' },
    { code: 'EH', name: '西撒哈拉' },
    { code: 'ER', name: '厄立特里亚' },
    { code: 'ES', name: '西班牙' },
    { code: 'ET', name: '埃塞俄比亚' },
    { code: 'FI', name: '芬兰' },
    { code: 'FJ', name: '斐济' },
    { code: 'FK', name: '福克兰群岛（马尔维纳斯）' },
    { code: 'FM', name: '密克罗尼西亚联邦' },
    { code: 'FO', name: '法罗群岛' },
    { code: 'GA', name: '加蓬' },
    { code: 'GD', name: '格林纳达' },
    { code: 'GE', name: '格鲁吉亚' },
    { code: 'GF', name: '法属圭亚那' },
    { code: 'GG', name: '根西' },
    { code: 'GH', name: '加纳' },
    { code: 'GI', name: '直布罗陀' },
    { code: 'GL', name: '格陵兰' },
    { code: 'GM', name: '冈比亚' },
    { code: 'GN', name: '几内亚' },
    { code: 'GP', name: '瓜德罗普' },
    { code: 'GQ', name: '赤道几内亚' },
    { code: 'GR', name: '希腊' },
    { code: 'GS', name: '南乔治亚岛和南桑威奇群岛' },
    { code: 'GT', name: '危地马拉' },
    { code: 'GU', name: '关岛' },
    { code: 'GW', name: '几内亚比绍' },
    { code: 'GY', name: '圭亚那' },
    { code: 'HM', name: '赫德岛和麦克唐纳群岛' },
    { code: 'HN', name: '洪都拉斯' },
    { code: 'HR', name: '克罗地亚' },
    { code: 'HT', name: '海地' },
    { code: 'HU', name: '匈牙利' },
    { code: 'ID', name: '印度尼西亚' },
    { code: 'IE', name: '爱尔兰' },
    { code: 'IL', name: '以色列' },
    { code: 'IM', name: '马恩岛' },
    { code: 'IN', name: '印度' },
    { code: 'IO', name: '英属印度洋领地' },
    { code: 'IQ', name: '伊拉克' },
    { code: 'IR', name: '伊朗' },
    { code: 'IS', name: '冰岛' },
    { code: 'IT', name: '意大利' },
    { code: 'JE', name: '泽西' },
    { code: 'JM', name: '牙买加' },
    { code: 'JO', name: '约旦' },
    { code: 'KE', name: '肯尼亚' },
    { code: 'KG', name: '吉尔吉斯斯坦' },
    { code: 'KH', name: '柬埔寨' },
    { code: 'KI', name: '基里巴斯' },
    { code: 'KM', name: '科摩罗' },
    { code: 'KN', name: '圣基茨和尼维斯' },
    { code: 'KP', name: '朝鲜' },
    { code: 'KW', name: '科威特' },
    { code: 'KY', name: '开曼群岛' },
    { code: 'KZ', name: '哈萨克斯坦' },
    { code: 'LA', name: '老挝' },
    { code: 'LB', name: '黎巴嫩' },
    { code: 'LC', name: '圣卢西亚' },
    { code: 'LI', name: '列支敦士登' },
    { code: 'LK', name: '斯里兰卡' },
    { code: 'LR', name: '利比里亚' },
    { code: 'LS', name: '莱索托' },
    { code: 'LT', name: '立陶宛' },
    { code: 'LU', name: '卢森堡' },
    { code: 'LV', name: '拉脱维亚' },
    { code: 'LY', name: '利比亚' },
    { code: 'MA', name: '摩洛哥' },
    { code: 'MC', name: '摩纳哥' },
    { code: 'MD', name: '摩尔多瓦' },
    { code: 'ME', name: '黑山' },
    { code: 'MF', name: '法属圣马丁' },
    { code: 'MG', name: '马达加斯加' },
    { code: 'MH', name: '马绍尔群岛' },
    { code: 'MK', name: '北马其顿' },
    { code: 'ML', name: '马里' },
    { code: 'MM', name: '缅甸' },
    { code: 'MN', name: '蒙古' },
    { code: 'MO', name: '中国澳门' },
    { code: 'MP', name: '北马里亚纳群岛' },
    { code: 'MQ', name: '马提尼克' },
    { code: 'MR', name: '毛里塔尼亚' },
    { code: 'MS', name: '蒙特塞拉特' },
    { code: 'MT', name: '马耳他' },
    { code: 'MU', name: '毛里求斯' },
    { code: 'MV', name: '马尔代夫' },
    { code: 'MW', name: '马拉维' },
    { code: 'MX', name: '墨西哥' },
    { code: 'MY', name: '马来西亚' },
    { code: 'MZ', name: '莫桑比克' },
    { code: 'NA', name: '纳米比亚' },
    { code: 'NC', name: '新喀里多尼亚' },
    { code: 'NE', name: '尼日尔' },
    { code: 'NF', name: '诺福克岛' },
    { code: 'NG', name: '尼日利亚' },
    { code: 'NI', name: '尼加拉瓜' },
    { code: 'NL', name: '荷兰' },
    { code: 'NO', name: '挪威' },
    { code: 'NP', name: '尼泊尔' },
    { code: 'NR', name: '瑙鲁' },
    { code: 'NU', name: '纽埃' },
    { code: 'NZ', name: '新西兰' },
    { code: 'OM', name: '阿曼' },
    { code: 'PA', name: '巴拿马' },
    { code: 'PE', name: '秘鲁' },
    { code: 'PF', name: '法属波利尼西亚' },
    { code: 'PG', name: '巴布亚新几内亚' },
    { code: 'PH', name: '菲律宾' },
    { code: 'PK', name: '巴基斯坦' },
    { code: 'PL', name: '波兰' },
    { code: 'PM', name: '圣皮埃尔和密克隆' },
    { code: 'PN', name: '皮特凯恩群岛' },
    { code: 'PR', name: '波多黎各' },
    { code: 'PS', name: '巴勒斯坦国' },
    { code: 'PT', name: '葡萄牙' },
    { code: 'PW', name: '帕劳' },
    { code: 'PY', name: '巴拉圭' },
    { code: 'QA', name: '卡塔尔' },
    { code: 'RE', name: '留尼汪' },
    { code: 'RO', name: '罗马尼亚' },
    { code: 'RS', name: '塞尔维亚' },
    { code: 'RW', name: '卢旺达' },
    { code: 'SA', name: '沙特阿拉伯' },
    { code: 'SB', name: '所罗门群岛' },
    { code: 'SC', name: '塞舌尔' },
    { code: 'SD', name: '苏丹' },
    { code: 'SE', name: '瑞典' },
    { code: 'SH', name: '圣赫勒拿、阿森松和特里斯坦-达库尼亚' },
    { code: 'SI', name: '斯洛文尼亚' },
    { code: 'SJ', name: '斯瓦尔巴和扬马延' },
    { code: 'SK', name: '斯洛伐克' },
    { code: 'SL', name: '塞拉利昂' },
    { code: 'SM', name: '圣马力诺' },
    { code: 'SN', name: '塞内加尔' },
    { code: 'SO', name: '索马里' },
    { code: 'SR', name: '苏里南' },
    { code: 'SS', name: '南苏丹' },
    { code: 'ST', name: '圣多美和普林西比' },
    { code: 'SV', name: '萨尔瓦多' },
    { code: 'SX', name: '荷属圣马丁' },
    { code: 'SY', name: '叙利亚' },
    { code: 'SZ', name: '埃斯瓦蒂尼' },
    { code: 'TC', name: '特克斯和凯科斯群岛' },
    { code: 'TD', name: '乍得' },
    { code: 'TF', name: '法属南部领地' },
    { code: 'TG', name: '多哥' },
    { code: 'TH', name: '泰国' },
    { code: 'TJ', name: '塔吉克斯坦' },
    { code: 'TK', name: '托克劳' },
    { code: 'TL', name: '东帝汶' },
    { code: 'TM', name: '土库曼斯坦' },
    { code: 'TN', name: '突尼斯' },
    { code: 'TO', name: '汤加' },
    { code: 'TR', name: '土耳其' },
    { code: 'TT', name: '特立尼达和多巴哥' },
    { code: 'TV', name: '图瓦卢' },
    { code: 'TZ', name: '坦桑尼亚' },
    { code: 'UA', name: '乌克兰' },
    { code: 'UG', name: '乌干达' },
    { code: 'UM', name: '美国本土外小岛屿' },
    { code: 'UY', name: '乌拉圭' },
    { code: 'UZ', name: '乌兹别克斯坦' },
    { code: 'VA', name: '梵蒂冈' },
    { code: 'VC', name: '圣文森特和格林纳丁斯' },
    { code: 'VE', name: '委内瑞拉' },
    { code: 'VG', name: '英属维尔京群岛' },
    { code: 'VI', name: '美属维尔京群岛' },
    { code: 'VN', name: '越南' },
    { code: 'VU', name: '瓦努阿图' },
    { code: 'WF', name: '瓦利斯和富图纳' },
    { code: 'WS', name: '萨摩亚' },
    { code: 'YE', name: '也门' },
    { code: 'YT', name: '马约特' },
    { code: 'ZA', name: '南非' },
    { code: 'ZM', name: '赞比亚' },
    { code: 'ZW', name: '津巴布韦' }
] as const

export function CountrySection({ control, fieldName }: CountrySectionProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [showSearchResults, setShowSearchResults] = useState(false)

    return (
        <Controller
            name={fieldName}
            control={control}
            render={({ field }) => {
                const selectedCodes = (field.value as string[]) || []
                const excludeFieldName = fieldName.replace('country', 'country_exclude')
                
                const handleAddCountry = (code: string) => {
                    if (!selectedCodes.includes(code)) {
                        field.onChange([...selectedCodes, code])
                    }
                    setSearchTerm('')
                    setShowSearchResults(false)
                }

                const handleRemoveCountry = (code: string) => {
                    field.onChange(selectedCodes.filter(c => c !== code))
                }

                const getCountryName = (code: string) => {
                    const country = ALL_COUNTRIES.find(c => c.code === code)
                    return country ? country.name : code
                }

                const filteredCountries = ALL_COUNTRIES
                    .filter(country =>
                        !selectedCodes.includes(country.code) &&
                        (country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            country.code.includes(searchTerm))
                    )
                    .slice(0, 10)

                return (
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-2">
                            <Label className="block">
                                国家
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor={`${fieldName}-exclude`} className="text-sm text-muted-foreground">
                                    排除模式
                                </Label>
                                <Controller
                                    name={excludeFieldName}
                                    control={control}
                                    render={({ field: excludeField }) => (
                                        <Switch
                                            id={`${fieldName}-exclude`}
                                            checked={excludeField.value || false}
                                            onCheckedChange={excludeField.onChange}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {selectedCodes.length > 0 && (
                            <div className="mb-3">
                                <div className="text-xs text-muted-foreground mb-1">已选择:</div>
                                <div className="flex flex-wrap gap-1">
                                    {selectedCodes.map(code => (
                                        <Badge
                                            key={code}
                                            variant="secondary"
                                            className="cursor-pointer hover:bg-red-100 hover:text-red-700"
                                            onClick={() => handleRemoveCountry(code)}
                                        >
                                            {getCountryName(code)} ({code}) ×
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-3">
                            <div className="text-xs text-muted-foreground mb-1">常用国家:</div>
                            <div className="flex flex-wrap gap-1">
                                {POPULAR_COUNTRIES.map(country => {
                                    const isSelected = selectedCodes.includes(country.code)
                                    return (
                                        <Badge
                                            key={country.code}
                                            variant={isSelected ? "default" : "outline"}
                                            className={`cursor-pointer transition-colors ${isSelected
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-green-100 hover:text-green-700"
                                                }`}
                                            onClick={() => !isSelected && handleAddCountry(country.code)}
                                        >
                                            {country.name} {isSelected ? '' : '+'}
                                        </Badge>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="text-xs text-muted-foreground mb-1">搜索其他国家:</div>
                            <Input
                                placeholder="输入国家名称或二字母代码（如CN、US）..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    setShowSearchResults(e.target.value.length > 0)
                                }}
                                onFocus={() => setShowSearchResults(searchTerm.length > 0)}
                                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                            />

                            {showSearchResults && filteredCountries.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                                    {filteredCountries.map(country => (
                                        <div
                                            key={country.code}
                                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleAddCountry(country.code)}
                                        >
                                            {country.name} ({country.code})
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )
            }}
        />
    )
} 