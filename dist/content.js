(function () {
  if (typeof fillForm === "undefined") {
    // Lắng nghe tin nhắn từ extension
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "AUTO_FILL") {
        const { topic, passage } = message;
        fillForm(topic, passage);
      }
    });

    // Hàm chính để điền thông tin vào form
    const fillForm = (topic, passage) => {
      console.log("Số lần thực thi fillForm");

      const title = document.getElementById("title");
      const editors = document.querySelectorAll('[contenteditable="true"]');
      const checkbox = document.getElementById("agreement-checkbox-base");

      if (!title || editors.length === 0) {
        console.error("Không tìm thấy title hoặc editors.");
        return;
      }

      // Điền giá trị vào title và editors
      fillTitle(title, topic);
      updateEditorContent(editors, passage);

      // Kiểm tra và click checkbox nếu title và editors đã được điền
      setTimeout(() => {
        checkAndClickCheckbox(title, editors, checkbox, passage);
      }, 300); // Chờ 300ms để đảm bảo các thay đổi đã được thực thi

      // Kiểm tra xem observer đã được khởi tạo hay chưa từ chrome.storage
      chrome.storage.local.get("observerInitialized", (result) => {
        if (!result.observerInitialized) {
          const observer = new MutationObserver(() => {
            // Quan sát các thay đổi trong DOM
            fillTitle(title, topic);
            updateEditorContent(editors, passage);
            checkAndClickCheckbox(title, editors, checkbox, passage);
          });

          // Quan sát sự thay đổi trong DOM của title và editors
          observer.observe(title, { childList: true, subtree: true });
          editors.forEach((editor) => {
            observer.observe(editor, { childList: true, subtree: true });
          });

          chrome.storage.local.set({ observerInitialized: true });
        }
      });
    };

    // Hàm điền giá trị vào tiêu đề
    const fillTitle = (title, topic) => {
      if (title && title.value !== topic) {
        title.value = topic;
        title.dispatchEvent(new Event("input", { bubbles: true }));
        console.log("Đã cập nhật title:", topic);
      }
    };

    // Hàm mô phỏng tương tác người dùng để điền dữ liệu vào editor
    const updateEditorContent = async (editors, passage) => {
      if (editors && editors.length > 0) {
        for (const [index, editor] of editors.entries()) {
          console.log(`Đang xử lý editor ${index + 1}/${editors.length}`);
          editor.focus();

          // Gửi sự kiện beforeinput
          const beforeInputEvent = new InputEvent("beforeinput", {
            bubbles: true,
            cancelable: true,
            inputType: "insertText",
            data: passage,
          });
          editor.dispatchEvent(beforeInputEvent);

          // Cập nhật nội dung qua sự kiện input
          const inputEvent = new InputEvent("input", {
            bubbles: true,
            cancelable: true,
            inputType: "insertText",
            data: passage,
          });
          editor.dispatchEvent(inputEvent);

          console.log(`Đã hoàn thành việc nhập liệu cho editor ${index + 1}`);
          await new Promise((resolve) => setTimeout(resolve, 100)); // Chờ 100ms giữa các editor
        }
      } else {
        console.warn("Không tìm thấy editor hoặc danh sách editor rỗng.");
      }
    };

    // Kiểm tra tính hợp lệ của title và editors
    async function validateInputs(title, editors, passage) {
      const isTitleValid = title?.value?.trim() !== ""; // Kiểm tra title có giá trị không
      const areEditorsValid =
        editors.length > 0
          ? !Array.from(editors).some(
              (editor) => editor.textContent.trim() === ""
            ) // Kiểm tra editor có giá trị không
          : true; // Nếu không có editor, mặc định hợp lệ

      return { isTitleValid, areEditorsValid };
    }

    // Hàm kiểm tra và click vào checkbox nếu cả title và editors đã được điền
    const checkAndClickCheckbox = async (title, editors, checkbox, passage) => {
      const { isTitleValid, areEditorsValid } = await validateInputs(
        title,
        editors,
        passage
      );

      // Nếu title và editors đều hợp lệ và checkbox chưa được chọn, click vào checkbox
      if (isTitleValid && areEditorsValid && checkbox && !checkbox.checked) {
        console.log("Clicking the checkbox...");
        checkbox.click();
      } else {
        console.log("Checkbox không cần click hoặc không tìm thấy checkbox.");
      }
    };
  }
})();
