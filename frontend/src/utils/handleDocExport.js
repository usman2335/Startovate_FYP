import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, ImageRun } from "docx";
import { saveAs } from "file-saver";

export const exportTemplatesToWord = async (templateKeys, canvasId) => {
  const images = [];

  for (const key of templateKeys) {
    const container = document.getElementById(`template-${key}`);
    if (!container) continue;

    const canvas = await html2canvas(container);
    const imageDataUrl = canvas.toDataURL("image/png");
    const imageBlob = await (await fetch(imageDataUrl)).blob();

    const imageBuffer = await imageBlob.arrayBuffer();

    images.push(
      new Paragraph({
        children: [
          new ImageRun({
            data: imageBuffer,
            transformation: {
              width: 600,
              height: 800,
            },
          }),
        ],
        pageBreakBefore: true,
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: images,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `LeanCanvas_Templates_${canvasId}.docx`);
};
