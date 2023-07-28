import { useParams } from "react-router-dom";
import Card from "../../../../components/UI/Card";
import { useGetUserPostQuery } from "../../../../features/api/post";
import Loader from "../../../../components/UI/Loader";
import { LoaderContainer } from "../../index";

const Index = () => {
  const { name } = useParams();
  const { data: post, isLoading } = useGetUserPostQuery(name);

  return (
    <div>
      {!isLoading ? (
        post?.post.map((post: any) => <Card post={post} />)
      ) : (
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      )}
    </div>
  );
};

export default Index;
