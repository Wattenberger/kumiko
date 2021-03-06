const fs = require("fs");
const path = require("path");
const paper = require("paper");
const CWD = process.cwd();
const { clipperLib, clipperOffset, clipperUnite } = require("paper-clipper");

const outlineStroke = require("svg-outline-stroke");
const inPath = path.resolve(CWD, "scripts/export.svg");
const outPath = path.resolve(CWD, "scripts/export-processed.svg");
const inputStr = fs.readFileSync(inPath, "utf8");

const main = async () => {
  console.log("cleaning");
  // const outlined = await outlineStroke(inputStr);
  const project = new paper.Project();

  const svg = project.importSVG(inputStr);

  const clipper = await clipperLib.loadNativeClipperLibInstanceAsync(
    clipperLib.NativeClipperLibRequestedFormat.WasmWithAsmJsFallback
  );

  console.log("outlining paths");
  let runningPaths = [];
  const mergeChildren = async (group, depth = 0) => {
    return new Promise(async (resolve) => {
      if (group.children) {
        let i = 0;
        // const children = group.children.map((d) => d.clone());
        for (const child of group.children) {
          i++;
          if (depth < 2)
            console.log(`outlining ${i} of ${group.children.length} paths`);
          await mergeChildren(child, depth + 1);
        }
      } else {
        if (group.segments && group.type != "rectangle" && group.strokeWidth) {
          try {
            const clone = { ...group };
            const newPath = await clipperOffset(clipper)(
              clone,
              clone.strokeWidth
            );
            runningPaths = [...runningPaths, ...newPath];

            // if (runningPaths.length > 0) {
            //   const unitedPaths = runningPaths[0].unite(newPath[0]);
            //   runningPaths = [unitedPaths];
            // } else {
            //   runningPaths = [...runningPaths, ...newPath];
            // }
          } catch (e) {
            console.log("Issue outlining path", group, e);
          }
        }
      }

      // if (runningPaths.length > 1000) {
      // const unitedPaths = await clipperUnite(clipper)(runningPaths);
      // runningPaths = [unitedPaths];
      // }
      resolve();
    });
  };
  await mergeChildren(svg);

  console.log(`uniting ${runningPaths.length} paths`);
  const unitedPaths = await clipperUnite(clipper)(runningPaths);

  // // Offset a Paper.js Path by 10 pixels
  // const offsetPaths = await clipperOffset(clipper)(path, 10)

  // // Unite two Paper.js Paths
  // const paths = [new paper.Path(..), new paper.Path(..)]
  // const unitedPaths = await clipperUnite(clipper)(paperPaths)

  const newLayer = new paper.Layer();
  newLayer.addChildren(unitedPaths);

  svg.clear();
  svg.addLayer(newLayer);

  console.log("exporting");
  const result = project.exportSVG(svg);

  fs.writeFileSync(outPath, result);
};
main();
