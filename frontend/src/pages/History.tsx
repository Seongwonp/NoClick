import React from 'react';

const History: React.FC = () => {
  return (
    <div className="flex-grow pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="font-display-lg text-[40px] font-bold text-on-background mb-4">
          My History
        </h1>
        <p className="font-body-lg text-[16px] text-on-surface-variant max-w-2xl mx-auto">
          이전에 분석했던 리뷰 내역들이 이곳에 표시됩니다. (준비 중)
        </p>
      </div>
    </div>
  );
};

export default History;
