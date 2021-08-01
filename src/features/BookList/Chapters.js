import { Component } from "react";
import { Accordion } from "react-bootstrap";
import "../../App.css";
import API from "../../Helpers/API";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalBoxForMsg from "../shrable/modalbox";
import CompleteStatusBar from "../shrable/completeStatusBar";

class BookList extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      superCategories: [],
      subCategories: [],
      SubCategoryList: {},
      notFound: "Child categories not found",
    };
  }

  componentDidMount() {
    this.bookApiReq();
  }
  handleClick(m) {
    this.setState({ subCategories: [] });

    if (!m.hasOwnProperty("completeCount")) {
      return;
    }

    var keys = Object.keys(this.state.SubCategoryList);

    if (keys.includes(m.id.toString()) == true) {
      this.setState({ subCategories: this.state.SubCategoryList[m.id] });
    } else {
      var BASE_URL = `/api/book/maths/section/${m.id}`;
      var res = API(`${BASE_URL}`);
      res.then((res) => {
        var resAll = res.response[m.id];
        var newarr = [];
        newarr = this.state.SubCategoryList;
        newarr[m.id] = resAll;
        this.setState({ SubCategoryList: newarr });

        this.setState({ subCategories: res.response[m.id] });
      });
    }
  }
  countRatio(singleSup) {
    if (!singleSup.childrenCount || !singleSup.completeCount) {
      return 0;
    }
    var final = Math.ceil(
      (100 * singleSup.completeCount) / singleSup.childrenCount
    );
    return final;
  }
  bookApiReq() {
    var BASE_URL = "/api/book/maths";
    var res = API(`${BASE_URL}`);
    res.then((res) => {
      this.setState({ superCategories: res.response });
    });
  }

  render() {
    return (
      <div>
        <div className="">
          {this.state.superCategories == null ||
          this.state.superCategories[0] == null ? (
            <div />
          ) : (
            <div className="">
              <Accordion defaultActiveKey="0">
                {this.state.superCategories.map((m) => (
                  <Accordion.Item
                    eventKey={m.id}
                    onClick={() => this.handleClick(m)}
                  >
                    <Accordion.Header>
                      <div className="md-1">
                        <div> {m.title} </div>
                        <div>
                          <CompleteStatusBar countRatio={this.countRatio(m)} />
                        </div>
                      </div>
                    </Accordion.Header>

                    {!m.hasOwnProperty("completeCount") ? (
                      <Accordion.Body>
                        {" "}
                        <ModalBoxForMsg msg={this.state.notFound} />
                      </Accordion.Body>
                    ) : (
                      <Accordion.Body>
                        <ul>
                          {this.state.subCategories.map((obj, index) => (
                            <li key={obj.id}><b>{obj.title}</b> - {obj.status.replace("_", " ")}</li>
                          ))}
                        </ul>
                      </Accordion.Body>
                    )}
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default BookList;
