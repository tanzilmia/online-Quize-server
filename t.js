const matchUser = await User.findOne({ email: email });
const token = jwt.sign({ email: matchUser.email }, `${process.env.JWT_SECRET}`);
res.send({ message: "Successfull", data: token });
