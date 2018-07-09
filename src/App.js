import React from "react";
import "./App.css";

export class CompB extends React.Component {
  render() {
    return (
      <div className="comp">
        <h3>CompB's render tree</h3>
        <p>
          You wont see this in your HOC's compB render tree because react has
          not run the reconciliation process yet
        </p>
        <p>
          Components return partial render trees (elements) and before rendering
          to the dom react grabs all those partial render trees and creates a
          single reconciled global tree (the real process might vary for
          performance reasons and what not but you get the idea). The important
          thing is that most of the time we deal with partial trees.
        </p>
      </div>
    );
  }
}

export class CompA extends React.Component {
  render() {
    return (
      <div className="comp">
        <h3>CompA's render tree</h3>
        <CompB comment="you wont see CompB's renderTree. Children is empty because React has not run the reconciliation process yet" />
      </div>
    );
  }
}

export function IIHoc(Comp) {
  return class extends Comp {
    render() {
      // this is the render tree or what react calls _element_
      // Each node of the render tree is an element, so what you
      // get here is an element that represents the _root_ of the render tree
      const renderTree = super.render();
      // Uncomment the debugger to see the real thing, we show the most
      // important attributes and remove some to avoid circular references
      //debugger

      return (
        <div className="comp">
          <h3>HOC's render tree</h3>
          <code>
            <pre>{JSON.stringify(toPrintable(renderTree), null, 2)}</pre>
          </code>
          <div>
            <h4>Reconciled render tree</h4>
            {renderTree}
          </div>
        </div>
      );
    }
  };
}

export default class App extends React.Component {
  render() {
    const EnhancedCompA = IIHoc(CompA);
    return (
      <div className="comp">
        <h3>App's render tree</h3>

        <EnhancedCompA />
      </div>
    );
  }
}

function toPrintable(element) {
  if (!element) {
    return "";
  }

  if (typeof element === "string") {
    return element;
  }

  const { $$typeof, type, props } = element;
  const { children, ...effectiveProps } = props;

  const typeStr = typeof type === "function" ? type.name : type;

  return {
    $$typeof: $$typeof.toString(),
    type: typeStr,
    props: {
      ...effectiveProps,
      children: Array.isArray(children)
        ? children.map(toPrintable)
        : toPrintable(children)
    }
  };
}
