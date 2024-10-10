import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles

const BlogEditor = () => {
  const [content, setContent] = useState("");

  return (
    <div>
      <ReactQuill theme="snow" value={content} onChange={setContent} />
    </div>
  );
};

export default BlogEditor;
