import { Wrapper } from "./ActivityInfoModal.styles";

export function ActivityInfoModal({activity}) {
  console.log(activity)
  return (
    <Wrapper>
      <p>{activity.title}</p>
      <p>Conversation</p>
      <p>Parent</p>
      <p>List of direct subactivities</p>
      <p>Members</p>
      <p>Labels</p>
    </Wrapper>
  )
}