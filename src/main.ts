import * as Blockly from 'blockly';
import { codeGen, createToolbox, loadBlocks } from './block-loader';
import './style.css';
import commandData from "./template.json" assert { type: 'json' };
import { CommandData } from './types/command';
const toolbox = createToolbox(loadBlocks(commandData as CommandData));
const input = document.getElementById("fileInput")! as HTMLInputElement;
const blocklyArea = document.getElementById('blocklyArea')!;
const blocklyDiv = document.getElementById('blocklyDiv')!;
const fileReader = new FileReader();
fileReader.addEventListener("loadend", e => {
  workspace.updateToolbox(createToolbox(loadBlocks(JSON.parse(fileReader.result! as string))));
  codeGen(commandData as CommandData, javaGenerator);
});
input.addEventListener("change", e => {
  const file = input.files?.item(0);
  if (file) {
    fileReader.readAsText(file);
  }
});
const workspace = Blockly.inject(blocklyDiv,
  { toolbox: toolbox });
let javaGenerator: Blockly.Generator = new Blockly.Generator("Java");
codeGen(commandData as CommandData, workspace,);
javaGenerator
setInterval(() => {
  // console.log(javaGenerator.workspaceToCode(workspace));
  // console.log(javaGenerator.statementToCode(workspace.getAllBlocks(true)[0], ),);
}, 1000);

const onresize = function (e: any) {
  // Compute the absolute coordinates and dimensions of blocklyArea.
  let element = blocklyArea;
  let x = 0;
  let y = 0;
  do {
    x += element!.offsetLeft;
    y += element!.offsetTop;
    element = element!.offsetParent as HTMLElement;
  } while (element);
  // Position blocklyDiv over blocklyArea.
  blocklyDiv.style.left = x + 'px';
  blocklyDiv.style.top = y + input.offsetHeight + 'px';
  blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
  blocklyDiv.style.height = blocklyArea.offsetHeight - input.offsetHeight - 1 + 'px';
  Blockly.svgResize(workspace);
};
window.addEventListener('resize', onresize, false);
onresize(null);