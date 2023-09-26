const form = document.getElementById("form"),
  imageGallery = document.getElementById("image-gallery");

const OPENAI_API_KEY = "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";
let isImageGenerating = false;

const updateImageCard = (imageDataArr) => {
  imageDataArr.map((imgObj, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgEl = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".download-btn");

    // Set the image source to the AI-generated image data
    const aiGeneratedImg = `data:image/jpeg;base64,${imgObj.b64_json}`;
    imgEl.src = aiGeneratedImg;

    // When the image loaded, remove the loading class and set download attribute
    imgEl.addEventListener("load", () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", aiGeneratedImg);
      downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
    });
  });
};

const generateAIImages = async (userPromot, userImageQuantity) => {
  try {
    // Send a request to the OpenAI API to generate images based on user inputs
    const res = await fetch(`https://api.openai.com/v1/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: userPromot,
        n: parseInt(userImageQuantity),
        size: "512x512",
        response_format: "b64_json",
      }),
    });
    await console.log(res.json());
    if (!res.ok) {
      throw new Error("Faild to generate images! Please try again.");
    }
    const { data } = await res.json(); // Get data from the response
    console.log(data);
    updateImageCard([...data]);
  } catch (error) {
    alert(error.message);
  } finally {
    isImageGenerating = false;
  }
};

const submitHandler = (eo) => {
  eo.preventDefault();
  if (isImageGenerating) return;
  isImageGenerating = true;

  //   Get user input and image quantity values fro the form
  const userPromot = eo.srcElement[0].value;
  const userImageQuantity = eo.srcElement[1].value;

  //   Cerating HTML markup for image cards with loading state
  const imgCard = Array.from(
    { length: userImageQuantity },
    () =>
      `<div class="img-card loading">
    <img src="images/loader.svg" alt="Image">
    <a href="#" class="download-btn">
        <img src="images/download.svg" alt="Download Iocn">
    </a>
</div>`
  ).join("");

  imageGallery.innerHTML = imgCard;
  generateAIImages(userPromot, userImageQuantity);
};

form.addEventListener("submit", submitHandler);
