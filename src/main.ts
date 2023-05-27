import * as Blockly from 'blockly';
import { codeGen, createToolbox, loadBlocks } from './block-loader';
import { javaCodegen, javaGenerator } from './codegen';
import './style.css';
import commandData from "./template.json" assert { type: 'json' };
import { CommandData } from './types/command';
Blockly.Blocks['ParallelCommandGroup'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("ParallelCommandGroup");
    this.appendStatementInput("commands")
      .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};
const toolbox = createToolbox(loadBlocks(commandData as CommandData));
toolbox.contents.push({ "kind": "block", "type": "ParallelCommandGroup" });
const blocklyArea = document.getElementById('blocklyArea')!;
const blocklyDiv = document.getElementById('blocklyDiv')!;
setInterval(() => {
  // console.log(javaGenerator.blockToCode(Blockly.Blocks["ParallelCommandGroup"  ]))
  console.log(javaGenerator.workspaceToCode(workspace))
}, 1000);
const input = document.getElementById("fileInput")! as HTMLInputElement;
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
codeGen(commandData as CommandData, javaGenerator);
javaGenerator.scrub_ = javaCodegen;
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