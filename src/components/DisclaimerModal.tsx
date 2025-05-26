import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose, onAccept }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold leading-6 text-gray-900 mb-4"
                >
                  使用須知
                </Dialog.Title>
                <div className="mt-2 space-y-4 max-h-[60vh] overflow-y-auto">
                  <p className="text-gray-600">
                    請注意：
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>請勿拍攝或上傳含有個人身份資訊的圖片（例如：面部特徵、身份證明、住址、聯絡方式等）。</li>
                    <li>本系統僅作為健康輔助用途，請避免傳送含有私密醫療資料或具隱私風險的內容。</li>
                    <li>為保護您的隱私，系統只會暫時記憶最近 10 則對話內容，用作回答與溝通建議之用，不會永久儲存或對外傳送。</li>
                  </ul>
                  <p className="text-gray-600 italic">
                    如您有任何疑慮，建議向醫療專業人員作進一步查詢。
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full py-3 px-4 text-sm font-medium text-white bg-black border border-black rounded-md hover:bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors"
                    onClick={onAccept}
                  >
                    知道
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DisclaimerModal; 