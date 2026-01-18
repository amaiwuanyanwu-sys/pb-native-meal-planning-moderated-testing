import React from 'react';

interface InfoBannerProps {
  message: string;
  className?: string;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({
  message,
  className = ''
}) => {
  return (
    <div className={`bg-[#F2F8FB] border border-[#007CB2] flex items-start ${className}`}>
      <div className="bg-[#007CB2] w-2 self-stretch shrink-0" />
      <div className="flex-1 flex gap-3 items-center pl-3 pr-2 py-0">
        <span className="material-icons-outlined text-[#007CB2] shrink-0" style={{ fontSize: '24px' }}>
          info
        </span>
        <div className="flex items-center py-2.5">
          <p className="text-sm font-medium text-[#007CB2]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
