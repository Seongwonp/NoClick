import React from 'react';
import { useNavigate } from 'react-router-dom';

const History: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-grow pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-[48px] text-outline opacity-40">history</span>
          </div>
          <h1 className="font-display-lg text-[40px] font-bold text-on-background mb-4">
            My History
          </h1>
          <p className="font-body-lg text-[16px] text-on-surface-variant max-w-md mx-auto">
            아직 분석한 리뷰 내역이 없습니다.<br/>홈 화면에서 첫 번째 리뷰 분석을 시작해보세요!
          </p>
          <button 
            onClick={() => navigate('/')}
            className="mt-10 bg-primary text-white px-8 py-3 rounded-xl font-bold active:scale-95 transition-all shadow-md hover:bg-primary-container hover:text-on-primary-container cursor-pointer"
          >
            분석 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;
