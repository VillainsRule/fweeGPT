import navigatorKeys from './keys/navigator.js';
import windowKeys from './keys/window.js';

import {
    commonHeapSizeLimits,
    commonScreenSizes,
    commonUserAgents,
    hardwareConcurrencyToHeapSizeLimit
} from './constants.js';

const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const gptHomepage = await fetch('https://chatgpt.com/translate').then(res => res.text());

let oaiBuildId: string | undefined = undefined;

try {
    oaiBuildId = gptHomepage.match(/data-seq="([^"]+)"/)?.[1];
} catch (e) {
    console.error('[fweeGPT] failed to extract data-build from GPT homepage (should still work)');
}

function m1(t: any) {
    t = JSON.stringify(t);
    return TextEncoder ? btoa(String.fromCharCode(...new TextEncoder().encode(t))) : btoa(unescape(encodeURIComponent(t)));
}

const getConfig = () => {
    const allNumbers = '0123456789';
    const randomStringOf15Numbers = Array.from({ length: 15 }, () => allNumbers[Math.floor(Math.random() * allNumbers.length)]).join('');

    const chosenNaviKey = navigatorKeys[Math.floor(Math.random() * navigatorKeys.length)];
    const chosenHeapSizeLimit = commonHeapSizeLimits[Math.floor(Math.random() * commonHeapSizeLimits.length)];

    return [
        commonScreenSizes[Math.floor(Math.random() * commonScreenSizes.length)],
        '' + new Date,
        chosenHeapSizeLimit,
        1,
        commonUserAgents[Math.floor(Math.random() * commonUserAgents.length)],
        'https://www.googletagmanager.com/gtag/js?id=G-9SHBSK2D9J',
        gptHomepage.match(/data-build="([^"]+)"/)?.[1] || 'prod-' + crypto.randomUUID(),
        'en-US',
        'en-US',
        performance.now() - Number('1.' + randomStringOf15Numbers),
        `${chosenNaviKey}−function ${chosenNaviKey}() { [native code] }`,
        'document',
        windowKeys[Math.floor(Math.random() * windowKeys.length)],
        performance.now(),
        hardwareConcurrencyToHeapSizeLimit[chosenHeapSizeLimit as keyof typeof hardwareConcurrencyToHeapSizeLimit],
        Date.now() - randomNumber(100000, 500000)
    ] as [number, string, number, number, string, string, string, string, string, number, string, string, string, number, number, number];
}

const config = getConfig();
const deviceId = crypto.randomUUID();

function kpe(t: string) {
    let e = 2166136261;
    for (let n = 0; n < t.length; n++)
        e ^= t.charCodeAt(n),
            e = Math.imul(e, 16777619) >>> 0;
    return e ^= e >>> 16,
        e = Math.imul(e, 2246822507) >>> 0,
        e ^= e >>> 13,
        e = Math.imul(e, 3266489909) >>> 0,
        e ^= e >>> 16,
        (e >>> 0).toString(16).padStart(8, '0')
}

const powRunCheck = (e: number, n: string, s: string, o: any, a: number) => {
    o[3] = a;
    o[9] = Math.round(performance.now() - e);
    const r = m1(o);
    return kpe(n + r).substring(0, s.length) <= s ? r + '~S' : null
};

const powGenAnswerSync = (e: string, n: string) => {
    const s = performance.now();
    try {
        const o = getConfig();
        for (let a = 0; a < 99999; a++) {
            const r = powRunCheck(s, e, n, o, a);
            if (r) return r;
        }
    } catch (o) {
        console.error('[fweeGPT] fuck, pow failed', o);
    }
    return null;
}

interface powChallenge {
    proofofwork: {
        required: boolean;
        seed: string;
        difficulty: string;
    };
}

const powGetAnswer = (e: powChallenge) => {
    var l;
    const s = 'gAAAAAB';
    if (!((l = e == null ? void 0 : e.proofofwork) != null && l.required))
        return null;
    const { seed: o, difficulty: a } = e.proofofwork;
    if (!(typeof o == 'string' && typeof a == 'string'))
        return null;
    if (true) {
        const c = powGenAnswerSync(o, a);
        const u = s + c;
        return u;
    }
}

interface Message {
    id: string;
    author: { role: string };
    create_time: number;
    content: {
        content_type: 'text';
        parts: any[];
    }
}


const req1 = await fetch('https://chatgpt.com/backend-anon/sentinel/chat-requirements/prepare', {
    method: 'POST',
    headers: {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Content-Type': 'application/json',
        'Cookie': `oai-did=${deviceId}`,
        'Oai-Build-Id': oaiBuildId?.toString() || randomNumber(1000000000, 9999999999).toString(),
        'Oai-Client-Version': config[6].toString() || '',
        'Oai-DeviceId': deviceId,
        'Oai-Language': config[8] || 'en-US',
        'Origin': 'https://chatgpt.com',
        'Referer': 'https://chatgpt.com/translate',
        'User-Agent': config[4] || commonUserAgents[commonUserAgents.length * Math.random() | 0]
    },
    body: JSON.stringify({ p: 'gAAAAAC' + m1(config) })
});

const res1 = await req1.json() as any;

const powAnswer = powGetAnswer(res1);

const body = JSON.stringify({
    prepare_token: res1.prepare_token,
    proofofwork: powAnswer
});

const askGPT = async (params: { prompt: string, messages?: Message[] }) => {
    if (!params.prompt) throw new Error('no prompt specified to askGPT()');

    const req2 = await fetch('https://chatgpt.com/backend-anon/sentinel/chat-requirements/finalize', {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Content-Type': 'application/json',
            'Cookie': `oai-did=${deviceId}`,
            'Oai-Build-Id': oaiBuildId || randomNumber(1000000000, 9999999999).toString(),
            'Oai-Client-Version': config[6],
            'Oai-DeviceId': deviceId,
            'Oai-Language': config[7],
            'Origin': 'https://chatgpt.com',
            'Referer': 'https://chatgpt.com/translate',
            'User-Agent': config[4]
        },
        body
    });

    const res2 = await req2.json() as any;

    const req3 = await fetch('https://chatgpt.com/backend-anon/conversation', {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Content-Type': 'application/json',
            'Cookie': `oai-did=${deviceId}`,
            'Oai-Build-Id': oaiBuildId || randomNumber(1000000000, 9999999999).toString(),
            'Oai-Client-Version': config[6],
            'Oai-DeviceId': deviceId,
            'Oai-Language': config[7],
            'openai-sentinel-chat-requirements-token': res2.token,
            'openai-sentinel-proof-token': powAnswer!,
            'openai-sentinel-turnstile-token': powAnswer!, // you could at least check it serverside ffs
            'Origin': 'https://chatgpt.com',
            'Referer': 'https://chatgpt.com/translate',
            'User-Agent': config[4]
        },
        body: JSON.stringify({
            'action': 'next',
            'conversation_mode': { 'kind': 'primary_assistant' },
            'history_and_training_disabled': true,
            'is_visible': true,
            'messages': params.messages ?? [
                {
                    'id': crypto.randomUUID(),
                    'author': { 'role': 'user' },
                    'create_time': Math.floor(Date.now() / 1000),
                    'content': {
                        'content_type': 'text',
                        'parts': [params.prompt]
                    }
                }
            ],
            'model': 'gpt-4.0',
            'supported_encodings': ['v1'],
            'supports_buffering': true
        })
    });

    const res3 = await req3.text();

    const allDataLines = res3.split('\n').filter(line => line.startsWith('data: ')).map(line => line.replace('data: ', '')).filter(line => line !== '[DONE]');
    if (allDataLines.length === 0) console.error('[fweeGPT] gg couldnt find data, res:', res3);

    let finalResponse = '';

    for (const line of allDataLines) {
        try {
            const json = JSON.parse(line.trim());
            if (typeof json === 'object') {
                if (json.o === 'append' && typeof json.v === 'string') finalResponse += json.v;

                if (json.o === 'patch' && typeof json.v === 'object') json.v.forEach((e: any) => {
                    if (e.o === 'append' && typeof e.v === 'string') finalResponse += e.v;
                });

                if (typeof json.v === 'string' && !json.o) finalResponse += json.v;
            }
        } catch (e) {
            console.error('[fweeGPT] failed to parse line:', line, e);
        }
    }

    return finalResponse;
}

export default askGPT;