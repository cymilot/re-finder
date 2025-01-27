import { defaultBgColor } from "./consts";

const getIframeDOM = (iframeNode: HTMLIFrameElement) => {
  try {
    if (iframeNode.contentDocument) {
      return iframeNode.contentDocument;
    } else if (iframeNode.contentWindow && iframeNode.contentWindow.document) {
      return iframeNode.contentWindow.document;
    }
  } catch (error: any) {
    console.warn(`${chrome.i18n.getMessage("errRunAction")}: ${error.message}`);
  }
  return null;
};

const clearHighlight = (dom: Document) => {
  const highlighting = Array.from(dom.getElementsByClassName("highlighting"));
  for (const element of highlighting) {
    const parent = element.parentNode;
    if (!parent) continue;

    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element);
    }
    parent.removeChild(element);
  }
};

const highlight = (
  dom: Document,
  regex: RegExp,
  setting: { [key: string]: any }
) => {
  let count = 0;

  const treeWalker = dom.createTreeWalker(dom.body, NodeFilter.SHOW_TEXT);
  const ranges: Range[] = [];

  while (true) {
    const currentNode = treeWalker.nextNode();
    if (!currentNode) break;

    const text = currentNode.textContent;
    if (!text) continue;

    const matches = Array.from(text.matchAll(regex));
    for (const match of matches) {
      count++;
      const range = dom.createRange();
      range.setStart(currentNode, match.index);
      range.setEnd(currentNode, match.index + match[0].length);
      ranges.push(range);
    }
  }

  for (const range of ranges) {
    const highlightBg = document.createElement("mark");
    highlightBg.style.backgroundColor = setting.bgColor || defaultBgColor;
    highlightBg.className = "highlighting";
    try {
      range.surroundContents(highlightBg);
    } catch (error: any) {
      console.warn(
        `${chrome.i18n.getMessage("errRunAction")}: ${error.message}`
      );
    }
  }

  return count;
};

chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
  if (request.action === "search") {
    const setting = await chrome.storage.local.get(["bgColor"]);
    const pattern = request.searchInput;
    const flag = request.flag.join("");
    const regex = RegExp(pattern, flag);

    let count = highlight(document, regex, setting);

    const iframes = Array.from(document.querySelectorAll("iframe"));
    for (const i of iframes) {
      const doc = getIframeDOM(i);
      if (doc) {
        count += highlight(doc, regex, setting);
      }
    }

    sendResponse({
      result: `${chrome.i18n.getMessage(
        "sucSearch1"
      )} ${count} ${chrome.i18n.getMessage("sucSearch2")}`,
    });
  } else if (request.action === "clear") {
    clearHighlight(document);

    const iframes = Array.from(document.querySelectorAll("iframe"));
    for (const i of iframes) {
      const doc = getIframeDOM(i);
      if (doc) clearHighlight(doc);
    }
  } else {
    sendResponse({ result: chrome.i18n.getMessage("errActionNotFound") });
  }
});
