
function main(config) {
  const proxyCount = config?.proxies?.length ?? 0;
  const originalProviders = config?.["proxy-providers"] || {};
  const proxyProviderCount = typeof originalProviders === "object" ? Object.keys(originalProviders).length : 0;
  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理");
  }

  // 合并 proxy-providers
  config["proxy-providers"] = {
    ...originalProviders, // 保留原有配置
    ...proxyProviders     // 合并新配置
  };

  // // 定义你想要强制覆盖的全局对象
  // const overrides = {
  //   dns: dnsConfig.dns,
  //   ipv6: dnsConfig.ipv6,
  //   "unified-delay": dnsConfig["unified-delay"],
  //   "tcp-concurrent": dnsConfig["tcp-concurrent"],
  //   tun: dnsConfig.tun,
  //   sniffer: dnsConfig.sniffer,
  //   profile: dnsConfig.profile,

  //   "geodata-mode": dnsConfig["geodata-mode"],
  //   "geo-auto-update": dnsConfig["geo-auto-update"],
  //   "geo-update-interval": dnsConfig["geo-update-interval"],
  //   "geox-url": dnsConfig["geox-url"]
  //   // 在这里添加任何你想一并覆盖的根字段
  // };
  // 使用 Object.assign 一次性将 overrides 里的所有字段合并进 config
  
  // 这会直接替换 config 中已有的同名根字段，或者新增不存在的字段
  Object.assign(config, dnsConfig);

  // // 覆盖原配置中DNS配置
  // const { dns, ...rootConfig } = dnsConfig;
  // Object.assign(config, rootConfig);  // geo/sniffer/profile/tun 等根级别字段正确挂载
  // config["dns"] = dns;                // dns 单独赋值

  // 覆盖原配置代理组
  config["proxy-groups"] = proxyGroupConfig;

  // 覆盖原配置中的规则
  config["rule-providers"] = ruleProviders;
  config["rules"] = rules;

  // //覆盖通用配置
  //   config["mixed-port"] = 7890;
  //   config["allow-lan"] = true;
  //   config["bind-address"] = "*";
  //   config["ipv6"] = true;
  //   config["unified-delay"] = true;

  //全节点开启 UDP
  if (config["proxies"]) {
    config["proxies"].forEach(p => p.udp = true);
  }
  return config;
}





// 多订阅合并，这里添加额外的地址
const proxyProviders = {
  "一分": {
    "type": "http",
    "url": "https://dash.yfjc.xyz/api/v1/client/subscribe?token=24d7295e677b770c5058f2a50d2a4690",  // ← 替换为实际链接
    "interval": 86400,
    "path": "./providers/一分.yaml",
    "override": {
      // 节点名称前缀 p1，用于区别机场节点
      "additional-prefix": "一分 |"
    },
    "health-check": {
      "enable": true,
      "url": "https://www.gstatic.com/generate_204",
      "interval": 300,
      "timeout": 5000,
      "lazy": true
    }
  },
  "赔钱": {
    "type": "http",
    "url": "https://dash.yfjc.xyz/api/v1/client/subscribe?token=24d7295e677b770c5058f2a50d2a4690",  // ← 替换为实际链接
    "interval": 86400,
    "path": "./providers/赔钱.yaml",
    "override": {
      // 节点名称前缀 p1，用于区别机场节点
      "additional-prefix": "赔钱 |"
    },
    "health-check": {
      "enable": true,
      "url": "https://www.gstatic.com/generate_204",
      "interval": 300,
      "timeout": 5000,
      "lazy": true
    }
  },

};

//DNS配置
const dnsConfig = {
  dns: {
    "enable": true,
    "ipv6": true,
    "listen": "0.0.0.0:1053",
    "use-hosts": true,
    "use-system-hosts": true,
    "prefer-h3": false,
    "respect-rules": true,
    "cache-algorithm": "arc",
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-range-v6": "fd00::/8",
    "fake-ip-filter": [
      // 本地主机/设备
      "+.lan", "+.local",
      // Windows网络出现小地球图标
      "+.msftconnecttest.com", "+.msftncsi.com",
      // QQ快速登录检测失败
      "localhost.ptlogin2.qq.com", "localhost.sec.qq.com",
      // 微信快速登录检测失败
      "localhost.work.weixin.qq.com",
      "+.in-addr.arpa", "+.ip6.arpa",
      "time.*.com", "ntp.*.com",
      "+.market.xiaomi.com",
      "time.*.gov",
      "pool.ntp.org"
    ],
    // "fallback": [
    //   // "https://dns.adguard-dns.com/dns-query#ecs=1.1.1.1/24&ecs-override=true",
    //   // "https://dns.cloudflare.com/dns-query#ecs=1.1.1.1/24&ecs-override=true",
    //   // "https://dns.google/dns-query#ecs=1.1.1.1/24&ecs-override=true"

    //   "https://dns.adguard-dns.com/dns-query",
    //   "https://dns.cloudflare.com/dns-query",
    //   "https://dns.google/dns-query"
    // ],

    "direct-nameserver-follow-policy": true,
    "default-nameserver": ["tls://223.5.5.5", "tls://119.29.29.29"],
    "nameserver": [
      // "https://dns.adguard-dns.com/dns-query#ecs=1.1.1.1/24&ecs-override=true",
      // "https://dns.cloudflare.com/dns-query#ecs=1.1.1.1/24&ecs-override=true",
      // "https://dns.google/dns-query#ecs=1.1.1.1/24&ecs-override=true"
      "https://dns.adguard-dns.com/dns-query",
      "https://dns.cloudflare.com/dns-query",
      "https://dns.google/dns-query"
    ],

    "nameserver-policy": {
      "RULE-SET:direct,cn": [
        // "https://dns.alidns.com/dns-query#ecs=223.5.5.5/24&ecs-override=true",
        // "https://doh.pub/dns-query#ecs=223.5.5.5/24&ecs-override=true"
        "https://dns.alidns.com/dns-query",
        "https://doh.pub/dns-query"
      ],
    },

    "proxy-server-nameserver": [
      // "https://dns.alidns.com/dns-query#ecs=223.5.5.5/24&ecs-override=true",
      // "https://doh.pub/dns-query#ecs=223.5.5.5/24&ecs-override=true"
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],



  },
  ipv6: true,
  "unified-delay": true,
  "tcp-concurrent": true,
  tun: {
    "enable": true,
    "stack": "gvisor",
    "mtu": 1350,
    "dns-hijack": ["any:53", "tcp://any:53", "udp://any:53"],
    "strict-route": true,
    "auto-route": true,
    "auto-detect-interface": true,
  },

  sniffer: {
    enable: true,
    "parse-pure-ip": true,
    "force-dns-mapping": true,
    "override-destination": false,
    sniff: {
      HTTP: { ports: [80, 443], "override-destination": false },
      TLS: { ports: [443] }
    },
    "skip-domain": ["+.push.apple.com"],
    "skip-dst-address": [
      "91.105.192.0/23", "91.108.4.0/22", "91.108.8.0/21",
      "91.108.16.0/21", "91.108.56.0/22", "95.161.64.0/20",
      "149.154.160.0/20", "185.76.151.0/24",
      "2001:67c:4e8::/48", "2001:b28:f23c::/47",
      "2001:b28:f23f::/48", "2a0a:f280:203::/48"
    ]
  },

  profile: {
    "store-selected": true,
    "store-fake-ip": true
  },

  // Geo配置
  "geodata-mode": false,
  "geo-auto-update": true,
  "geo-update-interval": 24,
  "geox-url": {
    "geoip": "https://cdn.jsdelivr.net/gh/Loyalsoldier/geoip@release/geoip.dat",
    "geosite": "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat",
    "mmdb": "https://cdn.jsdelivr.net/gh/Loyalsoldier/geoip@release/Country.mmdb",
    "asn": "https://cdn.jsdelivr.net/gh/Loyalsoldier/geoip@release/GeoLite2-ASN.mmdb"
  },


};

// 规则集通用配置
const ruleProviderCommon = {
  "type": "http",
  "format": "yaml",
  "interval": 86400
};

//规则集配置
const ruleProviders = {
  // ... 你的所有规则集，此处省略，但完全保留 ...
  "direct": {
    //直连域名列表 direct.txt
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
    "path": "./ruleset/loyalsoldier/direct.yaml"
  },
  "proxy": {
    //代理域名列表
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt",
    "path": "./ruleset/loyalsoldier/proxy.yaml"
  },
  "reject": {
    //广告域名
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt",
    "path": "./ruleset/loyalsoldier/reject.yaml"
  },
  "private": {
    //私有网络专用域名列表
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt",
    "path": "./ruleset/loyalsoldier/private.yaml"
  },
  "apple": {
    //Apple 在中国大陆可直连的域名列表 
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt",
    "path": "./ruleset/loyalsoldier/apple.yaml"
  },
  "icloud": {
    //iCloud 域名列表
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt",
    "path": "./ruleset/loyalsoldier/icloud.yaml"
  },
  "google": {
    //[慎用]Google 在中国大陆可直连的域名列表 
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt",
    "path": "./ruleset/loyalsoldier/google.yaml"
  },

  "gfw": {
    // GFWList 域名列表
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
    "path": "./ruleset/loyalsoldier/gfw.yaml"
  },
  "tld-not-cn": {
    // 非中国大陆使用的顶级域名列表
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt",
    "path": "./ruleset/loyalsoldier/tld-not-cn.yaml"
  },
  "telegramcidr": {
    //Telegram 使用的 IP 地址列表
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt",
    "path": "./ruleset/loyalsoldier/telegramcidr.yaml"
  },
  "lancidr": {
    //局域网 IP 及保留 IP 地址列表
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt",
    "path": "./ruleset/loyalsoldier/lancidr.yaml"
  },
  "cncidr": {
    //中国大陆 IP 地址列表 
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt",
    "path": "./ruleset/loyalsoldier/cncidr.yaml"
  },
  "cn": {
    //中国大陆域名 
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.yaml",
    "path": "./ruleset//metacubex/geosite-cn.yaml"
  },
  "applications": {
    // 需要直连的常见软件列表 
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt",
    "path": "./ruleset/loyalsoldier/applications.yaml"
  },
  "bahamut": {
    //台湾知名动漫游戏社区
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/Bahamut.txt",
    "path": "./ruleset/xiaolin-007/bahamut.yaml"
  },
  "YouTube": {
    //油管
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/YouTube.txt",
    "path": "./ruleset/xiaolin-007/YouTube.yaml"
  },
  "Netflix": {
    //奈飞
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/Netflix.txt",
    "path": "./ruleset/xiaolin-007/Netflix.yaml"
  },
  "Spotify": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/Spotify.txt",
    "path": "./ruleset/xiaolin-007/Spotify.yaml"
  },
  "BilibiliHMT": {
    // 哔哩哔哩海外版（港澳台）
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/BilibiliHMT.txt",
    "path": "./ruleset/xiaolin-007/BilibiliHMT.yaml"
  },
  "AI": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/AI.txt",
    "path": "./ruleset/xiaolin-007/AI.yaml"
  },
  "TikTok": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/TikTok.txt",
    "path": "./ruleset/xiaolin-007/TikTok.yaml"
  },
};

// 分流规则
const rules = [

  // 下载工具-->下载节点
  //"PROCESS-NAME,IDMan.exe,下载节点",

  // 自定义直连规则
  "DOMAIN-SUFFIX,royqh.net,全局直连",
  "DOMAIN-SUFFIX,zhihuishu.com,全局直连",
  "DOMAIN-SUFFIX,chatopens.ai,全局直连",
  "DOMAIN-SUFFIX,bpjgpt.top,全局直连",
  "DOMAIN-SUFFIX,mimicry.cool,全局直连",
  "DOMAIN-SUFFIX,maxweb.mobi,全局直连",
  "DOMAIN-SUFFIX,misacard.com,全局直连",
  // "DOMAIN-SUFFIX,alger.fun,全局直连",
  "DOMAIN-SUFFIX,sayqz.com,全局直连",
  "DOMAIN-SUFFIX,muyuan.do,全局直连",
  "IP-CIDR,38.0.0.0/8,DIRECT,no-resolve",
  "PROCESS-NAME,Kiro.exe,全局直连",
  "DOMAIN-SUFFIX,devzoo.top,全局直连",
  "DOMAIN-SUFFIX,chatlab.fun,全局直连",
  "PROCESS-NAME,Windsurf.exe,全局直连",

  // 自定义规则
  "DOMAIN-SUFFIX,googleapis.cn,节点选择", // Google服务
  "DOMAIN-SUFFIX,gstatic.com,节点选择", // Google静态资源
  "DOMAIN-SUFFIX,xn--ngstr-lra8j.com,节点选择", // Google Play下载服务
  "DOMAIN-SUFFIX,github.io,节点选择", // Github Pages
  "DOMAIN,v2rayse.com,节点选择", // V2rayse节点工具
  // Loyalsoldier 规则集
  "RULE-SET,applications,全局直连",
  "RULE-SET,private,全局直连",
  "RULE-SET,reject,广告过滤",
  "RULE-SET,icloud,苹果云服务",
  "RULE-SET,apple,苹果直连服务",
  "RULE-SET,YouTube,YouTube",
  "RULE-SET,Netflix,Netflix",
  "RULE-SET,bahamut,动画疯",
  "RULE-SET,Spotify,Spotify",
  "RULE-SET,BilibiliHMT,哔哩哔哩港澳台",
  "RULE-SET,AI,AI",
  "RULE-SET,TikTok,TikTok",
  "RULE-SET,google,谷歌服务",
  "RULE-SET,proxy,节点选择",
  "RULE-SET,gfw,节点选择",

  "RULE-SET,direct,全局直连",
  // 局域网
  "RULE-SET,lancidr,全局直连,no-resolve",
  // 国内域名
  "RULE-SET,cn,全局直连",
  // 中国大陆IP
  "RULE-SET,cncidr,全局直连,no-resolve",
  "GEOSITE,CN,全局直连",
  "GEOIP,LAN,全局直连,no-resolve",
  "GEOIP,CN,全局直连",

  "RULE-SET,telegramcidr,电报消息,no-resolve",
  "RULE-SET,tld-not-cn,节点选择",

  // 其他规则
  // "GEOSITE,CN,全局直连",
  // "GEOIP,LAN,全局直连,no-resolve",
  // "GEOIP,CN,全局直连,no-resolve",
  "MATCH,漏网之鱼" // 没有命中规则，最后通通代理，即白名单配置。
];

// 代理组通用配置
const groupBaseOption = {
  "interval": 300,
  "timeout": 3000,
  "url": "https://www.google.com/generate_204",
  "lazy": true,
  "max-failed-times": 3,
  "hidden": false
};

// 代理组配置
const proxyGroupConfig = [
  {
    ...groupBaseOption,
    "name": "节点选择",
    "type": "select",

    "include-all": true,
    "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
    "exclude-filter": "一分|赔钱",
    "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg"
  },
  {
    ...groupBaseOption,
    "name": "谷歌服务",
    "type": "select",
    "proxies": ["节点选择", "全局直连"],
    "include-all": true,
    "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
    "exclude-filter": "一分|赔钱",
    "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/google.svg"
  },
  {
    ...groupBaseOption,
    "name": "YouTube",
    "type": "select",
    "proxies": ["节点选择", "全局直连"],
    "include-all": true,
    "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
    "exclude-filter": "一分|赔钱",
    "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/youtube.svg"
  },
  {
    ...groupBaseOption,
    "name": "电报消息",
    "type": "select",
    //"proxies": ["节点选择", "全局直连"],
    "include-all": true,
    "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
    "exclude-filter": "一分|赔钱",
    "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/telegram.svg"
  },
  {
    ...groupBaseOption,
    "name": "AI",
    "type": "select",
    "include-all": true,
    //"proxies": ["节点选择"],
    "filter": "(?i)美国|美|USA|unitedstates",
    "exclude-filter": "一分|赔钱",
    "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/chatgpt.svg"
  },
  {
    ...groupBaseOption,
    "name": "Netflix",
    "type": "select",
    "proxies": ["节点选择", "全局直连"],
    "include-all": true,
    "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
    "exclude-filter": "一分|赔钱",
    "icon": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/icon/netflix.svg"
  },

  {
    ...groupBaseOption,
    "name": "TikTok",
    "type": "select",
    "include-all": true,
    "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
    "exclude-filter": "一分|赔钱",
    "proxies": ["节点选择"],
    "icon": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/icon/tiktok.svg"
  },
  {
    ...groupBaseOption,
    "name": "苹果云服务",
    "type": "select",
    "proxies": ["全局直连", "节点选择"],
    "include-all": true,
    "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
    "exclude-filter": "一分|赔钱",
    "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/microsoft.svg"
  },
  {
    ...groupBaseOption,
    "name": "苹果直连服务",
    "type": "select",
    "proxies": ["节点选择", "全局直连"],
    "include-all": true,
    "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
    "exclude-filter": "一分|赔钱",
    "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/apple.svg"
  },
  {
    ...groupBaseOption,
    "name": "动画疯",
    "type": "select",
    "proxies": ["节点选择"],
    "include-all": true,
    "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
    "exclude-filter": "一分|赔钱",
    "filter": "(?i)台|tw|TW",
    "icon": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/icon/Bahamut.svg"
  },
  {
    ...groupBaseOption,
    "name": "哔哩哔哩港澳台",
    "type": "select",
    "proxies": ["全局直连", "节点选择"],
    "include-all": true,
    "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
    "exclude-filter": "一分|赔钱",
    "icon": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/icon/bilibili.svg"
  },
  {
    ...groupBaseOption,
    "name": "Spotify",
    "type": "select",
    "proxies": ["节点选择", "全局直连"],
    "include-all": true,
    "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
    "exclude-filter": "一分|赔钱",
    "icon": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/icon/spotify.svg"
  },
  {
    ...groupBaseOption,
    "name": "广告过滤",
    "type": "select",
    "proxies": ["REJECT", "DIRECT"],
    "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/bug.svg"
  },
  {
    ...groupBaseOption,
    "name": "全局直连",
    "type": "select",
    "proxies": ["DIRECT", "节点选择"],
    "include-all": true,
    "exclude-filter": "一分|赔钱",
    "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg"
  },
  {
    ...groupBaseOption,
    "name": "全局拦截",
    "type": "select",
    "proxies": ["REJECT", "DIRECT"],
    "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/block.svg"
  },
  {
    ...groupBaseOption,
    "name": "漏网之鱼",
    "type": "select",
    "proxies": ["节点选择", "全局直连"],
    "include-all": true,
    "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
    "exclude-filter": "一分|赔钱",
    "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg"
  },
  {
    ...groupBaseOption,
    "name": "新加坡节点",
    "type": "select",        // 手动选，想自动选最快用 "url-test"
    "include-all": true,
    "filter": "(?i)新加坡|狮城|SG|singapore",  // 根据你的节点命名调整
    "exclude-filter": "一分|赔钱",
    "proxies": ["节点选择"], // 兜底：万一没筛到，走总选择器
    "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/sg.svg"
  },
  {
    ...groupBaseOption,
    "name": "下载节点",
    "type": "select",
    "use": ["一分", "赔钱"],  // 直接使用订阅的两个机场，不再筛选，避免误伤
    "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
    "proxies": ["节点选择"],  // 下载机场无可用节点时兜底走主力机场
    "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg"
  },
];

// 国内DNS服务器
const domesticNameservers = [
  "https://dns.alidns.com/dns-query", // 阿里云公共DNS
  "https://doh.pub/dns-query", // 腾讯DNSPod
  // "https://doh.360.cn/dns-query" // 360安全DNS
];
// 国外DNS服务器
const foreignNameservers = [
  "https://1.1.1.1/dns-query", // Cloudflare(主)
  "https://8.8.8.8/dns-query"
  // "https://1.0.0.1/dns-query", // Cloudflare(备)
  // "https://208.67.222.222/dns-query", // OpenDNS(主)
  // "https://208.67.220.220/dns-query", // OpenDNS(备)
  // "https://194.242.2.2/dns-query", // Mullvad(主)
  // "https://194.242.2.3/dns-query" // Mullvad(备)
];
