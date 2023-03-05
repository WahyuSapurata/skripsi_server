import mongoose from "mongoose";

const Jurnal = mongoose.Schema({
  tanggal: {
    type: String
  },
  deskrisi: {
    type: String
  },
  image: {
    type: String
  },
  url: {
    type: String
  },
  debet: {
    type: String
  },
  kredit: {
    type: String
  }
});

export default mongoose.model("jurnals", Jurnal);
