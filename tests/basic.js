import askGPT from '../dist/main';

const firstReq = performance.now();

const four = await askGPT({
    prompt: 'What is 2 + 2? Output ONLY the number and NO other text',
    modal: 'gpt-5.2-nano'
});

console.log('2 + 2 = ' + four);
console.log('query 1 took ' + (performance.now() - firstReq).toFixed(2) + 'ms');

const secondReq = performance.now();

const five = await askGPT({
    prompt: 'What OpenAI model are you? List your version and tag (i.e. gpt-6.7-sigma) and NO other text',
    modal: 'gpt-5.2-nano'
});

console.log('OAI model = ' + five);
console.log('query 2 took ' + (performance.now() - secondReq).toFixed(2) + 'ms');
