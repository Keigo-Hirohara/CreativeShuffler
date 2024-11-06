type Props = {
  isChecked: boolean;
  onClick: (isChecked: boolean) => void;
};
export const FixButton = ({ isChecked, onClick }: Props): JSX.Element => {
  return (
    <div className="flex items-center space-x-3 z-0">
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          value="固定"
          checked={isChecked}
          onChange={(e) => {
            onClick(e.target.checked);
          }}
          className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition duration-150 ease-in-out"
        />
        <span className="ml-2 text-sm font-medium text-gray-700">固定</span>
      </label>
    </div>
  );
};
