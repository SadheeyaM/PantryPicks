import Footer from "./components/Footer";

export default function Root(props) {
  return (
    <>
      <section>{props.name} is mounted!</section>
      <Footer />
    </>
  );
}
