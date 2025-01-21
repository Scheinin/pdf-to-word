import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// 设置 Worker 文件路径
GlobalWorkerOptions.workerSrc = './pdf.worker.min.js';

const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
const convertButton = document.getElementById(
	'convert-btn'
) as HTMLButtonElement;
const statusParagraph = document.getElementById(
	'status'
) as HTMLParagraphElement;

fileInput.addEventListener('change', () => {
	if (fileInput.files && fileInput.files[0]) {
		statusParagraph.textContent =
			"PDF file selected. Click 'Convert to Word' to start.";
	}
});

convertButton.addEventListener('click', async () => {
	if (fileInput.files && fileInput.files[0]) {
		const file = fileInput.files[0];

		// 更新状态
		statusParagraph.textContent = `Processing file: ${file.name}...`;

		try {
			// 读取 PDF 文件
			const pdfBytes = await file.arrayBuffer();
			const pdfDoc = await getDocument({ data: pdfBytes }).promise;
			const pageCount = pdfDoc.numPages;
			const textArray: string[] = [];

			for (let i = 1; i <= pageCount; i++) {
				const page = await pdfDoc.getPage(i);
				const textContent = await page.getTextContent();

				const pageText = textContent.items
					.map((item: any) => item.str)
					.join(' ');
				textArray.push(pageText);
			}

			const doc = new Document({
				sections: [
					{
						properties: {},
						children: textArray.map((pageText, index) => {
							return new Paragraph({
								children: [
									new TextRun(`Page ${index + 1}:`),
									new TextRun('\n'),
									new TextRun(pageText),
									new TextRun('\n'),
								],
							});
						}),
					},
				],
			});

			Packer.toBlob(doc).then((blob) => {
				const link = document.createElement('a');
				link.href = URL.createObjectURL(blob);
				link.download = file.name.replace(/\.pdf$/, '.docx');
				link.click();
			});

			// 更新状态
			statusParagraph.textContent =
				'Conversion successful! Downloading...';
		} catch (error) {
			console.error(error);
			statusParagraph.textContent =
				'Conversion failed. Please try again.';
		}
	} else {
		statusParagraph.textContent =
			'No file selected. Please select a PDF file first.';
	}
});
