import React, { Component } from 'react';
import './App.css';
import { GetAllKnowledge } from './utils/services';
import WordCloud from 'react-d3-cloud';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      knowledges: [],
      knowledgePremises: []
    }
  }

  async componentWillMount() {
    const {err, data} = await GetAllKnowledge();
    if (!err) {
      // 计算 knowledges 的 knowledgePremises
      let resu = {
        knowledges: data.knowledges,
        knowledgePremises: data.knowledgePremises
      };
      resu.knowledges.map((item, i) => {
        resu.knowledges[i].base = true;
        resu.knowledgePremises.map(d => {
          if (d.premise_knowledge_id == item.id) {
            !resu.knowledges[i].childrens && (resu.knowledges[i].childrens = [])
            resu.knowledges[i].childrens.push(d.knowledge_id)
          }
          if (d.knowledge_id == item.id) {
            resu.knowledges[i].base = false;
          }
        })
      })

      this.setState({...resu})
    }
  }

  findKnowledge = (id) => {
    const { knowledges } = this.state;
    // knowledges.map(d => {
    //   if (d.id == id) {
    //     return d;
    //   }
    // });

    for (let i=0; i< knowledges.length; i++) {
      if (knowledges[i].id == id) {
        return knowledges[i]
      }
    }
    return null
  } 

  // generateChildDom = (childrens) => {
  //   return (
  //     <div>
        
  //     </div>
  //   )
  // }

  generateChild = (item) => {
    const { knowledgePremises } = this.state;
    let childrens = [];
    item.childrens && item.childrens.map(id => {
        let item = this.findKnowledge(id);
        if (item) {
          childrens.push(item);
        }
    });
    if (childrens.length == 0) return;

    
    return (
      <div>
        {childrens.map(d => {
          return <dl key={d.id}>
            <dt>{d.title} <span className={"level"+d.level}>Lv.{d.level}</span></dt>
            <dd>{d.description}</dd>
    
            <dd>{this.generateChild(d)}</dd>
          </dl>
        })}
      </div>
    )
  }

  // findBaseKnowledge = (list) => {
  //   const { knowledgePremises } = this.state;
  //   let childrens = [];
  //   knowledgePremises.map(d => {
  //     if (d.premise_knowledge_id == item.id) {
  //       childrens.push(d);
  //     }
  //   });
  //   if (childrens.length == 0) return;
  // }

  render() {
    const { knowledges } = this.state;

    var data = [];
    knowledges.map(item => {
      data.push({
        text: item.title,
        value: item.importance * Math.random() * 100 * 5
      })
    })
    const fontSizeMapper = word => Math.log2(word.value) * 5;
    const rotate = word => word.value % 360;
    return (
      <div className="App">
        {/* 知识的海洋 */}
        {/* {knowledges.map(item => {
          return <dl key={item.id}>
            <dt>{item.title}</dt>
            <dd>{item.description}</dd>
          </dl>
        })} */}
        <div className={"knowledge-tree"}>
          {knowledges.filter(d => d.base).map(item => {
            return <dl className="top-knowledge" key={item.id}>
              <dt>{item.title} <span className={"level"+item.level}>Lv.{item.level}</span></dt>
              <dd>{item.description}</dd>

              <dd>{this.generateChild(item)}</dd>
            </dl>
          })}
        </div>

        <div className="word-cloud-wrapper">
          <WordCloud
            data={data}
            fontSizeMapper={fontSizeMapper}
            rotate={rotate}
          />
        </div>
      </div>
    );
  }
}

export default App;
