import React from "react";
import { Button, Input } from "../elements";

const Upload = () => {
  return (
    <>
      <div>
        <div>Menu 업로드</div>
        <input />
      </div>

      <div>
        <h2>미리보기</h2>
        <image />
      </div>

      <div>
        <Input label="Menu" placeholder="Menu를 소개해주세요!"></Input>
      </div>

      <div>
        <Button text="Menu 업로드"></Button>
      </div>
    </>
  );
};

export default Upload;