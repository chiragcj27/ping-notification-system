import Image from 'next/image';
import image1 from "../../public/cowboy-hat-face-svgrepo-com.svg";
import image2 from "../../public/face-savoring-food-svgrepo-com.svg";
import image3 from "../../public/face-with-monocle-svgrepo-com.svg";
import image4 from "../../public/face-with-steam-from-nose-svgrepo-com.svg";
import image5 from "../../public/grinning-face-with-smiling-eyes-svgrepo-com.svg";
import image6 from "../../public/partying-face-svgrepo-com.svg";
import image7 from "../../public/smiling-face-with-heart-eyes-svgrepo-com.svg";
import image8 from "../../public/smiling-face-with-hearts-svgrepo-com.svg";
import image9 from "../../public/smiling-face-with-horns-svgrepo-com.svg";
import image10 from "../../public/smiling-face-with-sunglasses-svgrepo-com.svg";

const images = [image1, image2, image3, image4, image5, image6, image7, image8, image9, image10];

interface RandomAvatarProps {
  userId: string;
}

const hashStringToNumber = (str: string, max: number): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash) % max;
};

const RandomAvatar: React.FC<RandomAvatarProps> = ({ userId }) => {
  const index = hashStringToNumber(userId, images.length);
  const avatarImage = images[index];

  return (
    <div className="avatar">
      <Image src={avatarImage} alt="Random Avatar" width={100} height={100} />
    </div>
  );
};

export default RandomAvatar;
