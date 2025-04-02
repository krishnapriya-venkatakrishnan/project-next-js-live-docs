import CollaborativeRoom from "@/components/CollaborativeRoom"

const Document = async ({params} : SearchParamProps) => {
  const {id} = await params;
  
  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
      roomId={id}
      />
    </main>
  )
}

export default Document