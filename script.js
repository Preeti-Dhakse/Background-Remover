document.addEventListener("DOMContentLoaded", () => {
    const uploadarea = document.getElementById('upload-area');
    const ImageInput = document.getElementById('ImageInput');
    const removebtn = document.getElementById('removeBackgroundBtn');
    const resetbtn = document.getElementById('resetBtn');
    const result = document.getElementById('result');
    const downloadBtn = document.getElementById('downloadBtn');

    let selectedFile = null;

    // Upload the file from user
    uploadarea.addEventListener("click", () => {
        ImageInput.click();
    });

    // Drag and drop
    uploadarea.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    uploadarea.addEventListener("drop", (e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
    });

    ImageInput.addEventListener("change", (e) => {
        handleFile(e.target.files[0]);
    });

    function handleFile(file) {
        if (file && file.type.startsWith("image/")) {
            selectedFile = file;
            const reader = new FileReader();
            reader.onload = () => {
                displayImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please upload a valid image format");
        }
    }

    function displayImage(imgsrc) {
        result.innerHTML = `<img src="${imgsrc}" alt="Processed Image" id="processedImage" />`;
        downloadBtn.style.display = "none"; // Initially hide download button
    }

    removebtn.addEventListener("click", () => {
        if (selectedFile) {
            removeBackground(selectedFile);
        } else {
            alert("Please upload an image first");
        }
    });

    async function removeBackground(file) {
        const apikey = "urL4ZfAsz7XHsMEE5mCEXmtt"; // Replace with a secure method
        const formData = new FormData();
        formData.append("image_file", file);
        formData.append("size", "auto");

        result.innerHTML = "<p>Removing Background...</p>";
        downloadBtn.style.display = "none"; // Hide download button during processing
        removebtn.style.backgroundColor = "#904e95"; // Change button color

        try {
            const response = await fetch("https://api.remove.bg/v1.0/removebg", {
                method: "POST",
                headers: {
                    "X-API-KEY": apikey,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const blob = await response.blob();
            const imgURL = URL.createObjectURL(blob);
            displayProcessedImage(imgURL);
        } catch (error) {
            console.error(error);
            result.innerHTML = "<p>Error removing background. Please try again.</p>";
        } finally {
            removebtn.style.backgroundColor = "#4a90e2"; // Reset button color
        }
    }

    function displayProcessedImage(imgURL) {
        result.innerHTML = `<img src="${imgURL}" alt="Processed Image" id="processedImage" />`;
        downloadBtn.style.display = "block"; // Show download button after successful processing
    }

    downloadBtn.addEventListener("click", () => {
        const processedImage = document.getElementById("processedImage");
        if (processedImage) {
            const link = document.createElement("a");
            link.href = processedImage.src;
            link.download = "background_remove.png";
            link.click();
        } 
    });

    resetbtn.addEventListener("click", () => {
        selectedFile = null;
        result.innerHTML = "<p>No Image Processed yet.</p>"; // Reset result area
        downloadBtn.style.display = "none"; // Hide download button
        ImageInput.value = ""; // Reset file input
    });
});
