import { useParams } from "react-router-dom";
import { useGetPostQuery } from "../../../../features/api/post";
import Card from "../../../../components/UI/Card";
import { IPost } from "../../../../utils/types/types";
import { LoaderContainer } from "../..";
import Loader from '../../../../components/UI/Loader'

const index = () => {
  const { name } = useParams();
  const { data, isLoading } = useGetPostQuery({});

  const likedPosts = data?.post.filter((postd: IPost) => {
    const liked = postd.likes.filter((pos) => {
      return pos.username === name;
    });

    return liked.length != 0;
  });

  return (
    <div>
      {!isLoading ? (
        likedPosts?.map((post: IPost) => <Card post={post} />)
      ) : (
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      )}
    </div>
  );
};

export default index;
