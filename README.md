## FreeGPT
(Ab)uses the [Translate](https://chatgpt.com/translate) endpoint of ChatGPT to give everyone free access to ChatGPT.

Still unpatched after 3 weeks of working (as of 2/14), and considering I already reported it to OAI, and I guess they just don't care. It's now an NPM package!!

```
npm i fweegpt
bun i fweegpt
```

Usage:

```js
import askGPT from 'fweegpt';

const response = await askGPT({ prompt: 'What is the meaning of life?' });
console.log(response);
```

The modal is gpt-4.0 only; this is a locked feature of the translate endpoint. It's also fairly slow since each translation takes 3 requests to succeed.

Takedowns: hi@villainsrule.xyz (OAI just email me it ain't that hard)