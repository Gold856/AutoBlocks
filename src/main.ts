import * as Blockly from 'blockly';
import { createToolbox, generateCommandList, load, loadBlocks } from './block-loader';
import { javaCommandCodeGen, javaGenerator } from './codegen';
import { initHardcodedBlocks } from './hardcoded-blocks';
import { activateJsonLoader, input } from './json-loader';
import './style.css';
import commandData from "./template.json" assert { type: "json" };
import test from "./testcommandlist.json" assert {type: "json"};
import { CommandData } from './types/command-data';
initHardcodedBlocks();
load(test)
const toolbox = createToolbox(generateCommandList(commandData as CommandData));
const blocklyArea = document.getElementById('blocklyArea')!;
const blocklyDiv = document.getElementById('blocklyDiv')!;
// console.log(javaGenerator.workspaceToCode(workspace))
const workspace = Blockly.inject(blocklyDiv,
  { toolbox: toolbox, });
activateJsonLoader(workspace);
javaCommandCodeGen(commandData as CommandData, javaGenerator);
workspace.addChangeListener((event: any) => {
  if (event instanceof Blockly.Events.BlockBase && !(event instanceof Blockly.Events.BlockCreate)) {
    console.log(javaGenerator.workspaceToCode(workspace))
  }
});
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