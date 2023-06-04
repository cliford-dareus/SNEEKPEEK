import { PageTitle } from "../../lib/styled-component/styles"
import Loader from '../../components/Loader'
import { useAppSelector } from "../../app/hooks"

const index = () => {
  const user = useAppSelector(state => state.auth.user?.username);

  return (
    <div>
      <PageTitle>
        <h1>Explore</h1>
        <div>
          {user? <p>{user}</p>:<Loader />}
        </div>
      </PageTitle>
    </div>
  )
}

export default index