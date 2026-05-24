export default function Footer({ settings }) {
    return (
        <div className=" flex justify-center gap-10 py-5 backdrop-blur border-t border-[#8cae3c]/30 text-[#ebd4aa] font-bold text-lg"
        style={{background:settings.colors.primaryDark}}
        >

        <div className="flex items-center gap-2">
           كثافة أكثر
        </div>

        <div className="w-px bg-[#b4a050]/30" />

        <div className="flex items-center gap-2">
          قوة أكبر
        </div>

        <div className="w-px bg-[#b4a050]/30" />

        <div className="flex items-center gap-2">
        ثقة تدوم
        </div>

      </div>
    )
}