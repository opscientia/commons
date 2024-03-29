import mongoose from 'mongoose'

const connect = () => {
  mongoose.connect(
    process.env.NEXT_PUBLIC_MONGODB_TEST_URI, //Replace with Production URI once we get ORCID Member credentials
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) console.log('Error connecting to MongoDB')
      else console.log('Connected to MongoDB')
    }
  )
}

export default connect
