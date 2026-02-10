import { FaExternalLinkAlt } from "react-icons/fa";

const TaskCard = () => {
    return (
        <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/20 hover:border-white/40 hover:bg-white/10 hover:cursor-pointer">
            <div className="flex items-center justify-between mb-3">
                <h1 className="text-xl font-bold">Task Card</h1>
                <span className=" relative before:content-[''] before:h-2 before:aspect-square before:rounded-full before:bg-red-500 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 pl-4 py-0.5 rounded-full text-xs text-red-400 ">Finished</span>
            </div>
            <p className=" text-white/70 line-clamp-2 leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque iste iure amet doloribus numquam soluta fugit alias, deleniti nesciunt architecto sequi veritatis eaque repudiandae, asperiores, similique dicta assumenda officia sunt.</p>
            <div className="flex items-center justify-between mt-6">
                 <p className="text-xs text-white/70">Due: 29 Feb 2026</p>
                <FaExternalLinkAlt className="text-white/40 hover:text-white hover:cursor-pointer"/>
            </div>
           
        </div>
    )
}

export default TaskCard;