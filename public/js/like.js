

document.addEventListener("DOMContentLoaded", () => {
    
    const buttons = document.querySelectorAll(".like-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", async function (e) {
            e.preventDefault();
            const postId = this.closest(".like-container").dataset.postId;
            
            const res = await fetch(`/post/${postId}/like`, {
                method: "POST"
            });
            const data = await res.json();
            
            this.querySelector(".heart").textContent = data.liked ? "❤️" : "🤍";
            
            const likeCount = this.closest(".like-container").querySelector(".like-count");
            
            likeCount.textContent = data.likeCount;
        });
    });
});
