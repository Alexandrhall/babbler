import Navbar from "../src/components/Navbar";
import RoomList from "../src/components/RoomList";
import ChatRoom from "../src/components/ChatRoom";
import withAuth from "../src/components/withAuth";

function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-row">
        <RoomList />
        <div className="text-white">RoomName Dashboard</div>
        <div className="w-full">
          <ChatRoom />
        </div>
      </main>
    </>
  );
}

export default withAuth(Home);
