import { Button } from "@/components/ui/button";
import { BsStars } from "react-icons/bs";
import { HiOutlinePhotograph } from "react-icons/hi";

type Props = {
  value: string;
  title: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  Url?: string;
  loading?: boolean;
};
export const Dashboard = ({
  value,
  title,
  onChange,
  onKeyDown,
  onClick,
  disabled,
  Url,
  loading,
}: Props) => {
  return (
    <div className="max-w-xl w-full space-y-6 ">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-family flex ">
            <span>
              <BsStars />
            </span>
            {title}
          </h2>
        </div>

        <label className="text-gray-400">
          Upload a food photo, and AI will detect the ingredients.
        </label>
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Хоолны тайлбар"
          className="w-full h-[130px] pb-20 pl-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="w-full flex justify-end">
          <Button
            onClick={onClick}
            disabled={disabled}
            className=" px-6 py-3  bg-gray-900 text-white rounded-lg  disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? "Generating..." : "Generate "}
          </Button>
        </div>
      </div>
      <div>
        <h2 className="flex gap-2 items-center font-family/sans">
          <span>
            <HiOutlinePhotograph />
          </span>{" "}
          Result
        </h2>
        <p className="text-gray-400">
          First, enter your text to generate an image.
        </p>
        {Url && (
          <div className="mt-8 border rounded-lg p-4 ">
            <h2>{title}</h2>
            <img src={Url} alt="Generated" className="w-full rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
};
