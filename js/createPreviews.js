function createPreviews() {
    for (let key in buildings) {
        // if the building is availabe
        if (buildings[key][4]) {
            preview = new Preview(
                key,
                GUIWidth / 2 - 65 + previewWidth * previewSize + previewWidth * 5,
                previewYOffset + previewHeight * previewSize + previewHeight * 5
            );

            previews.push(preview);
            previewWidth++;

            if (previewWidth === maxPreviewRows) {
                previewWidth = 0;
                previewHeight++;
            }
        }
    }
}