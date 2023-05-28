import * as Blockly from 'blockly';
import { createToolbox, generateCommandList, loadBlocks } from './block-loader';
import { codeGen, javaGenerator } from './codegen';
import { initHardcodedBlocks } from './hardcoded-blocks';
import { activateJsonLoader, input } from './json-loader';
import './style.css';
import commandData from "./template.json" assert { type: "json" };
import { CommandData } from './types/command-data';
initHardcodedBlocks();
loadBlocks(commandData as CommandData)
const toolbox = createToolbox(generateCommandList(commandData as CommandData));
const blocklyArea = document.getElementById('blocklyArea')!;
const blocklyDiv = document.getElementById('blocklyDiv')!;
// console.log(javaGenerator.workspaceToCode(workspace))
const workspace = Blockly.inject(blocklyDiv,
  { toolbox: toolbox });
activateJsonLoader(workspace);
codeGen(commandData as CommandData, javaGenerator);
const onresize = () => {
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
onresize();