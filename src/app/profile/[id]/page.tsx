interface Params {
  params: {
    id: string;
  };
}

export default function UserProfile({ params }: Params) {
  return (
    <main className=" flex h-screen flex-col items-center justify-center">
      <h1 className="mb-10 p-4 text-2xl">{params.id}&apos;s profile</h1>
    </main>
  );
}
