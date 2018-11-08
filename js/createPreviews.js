function createPreviews() {
    for (let i in buildings) {
        preview = new Preview(
            i,
            GUIWidth / 2 - 65 + previewWidth * previewSize + previewWidth * 5,
            previewYOffset + previewHeight * previewSize + previewHeight * 5
        );

        previews.push(preview);
        previewWidth++;

        if (previewWidth === maxPreviewRow) {
            previewWidth = 0;
            previewHeight++;
        }
    }
}