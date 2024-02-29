"use client";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { ListWithCards } from "@/types";
import { List } from "@prisma/client";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";

interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    console.log(orderedData);
    setOrderedData(data);
  }, [data, orderedData]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    //Droped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    //User moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index + 1 })
      );
      setOrderedData(items);
      // TODO: Trigger server action
    }

    //User moves a card
    if (type === "card") {
      let newOrderedData = [...orderedData];

      //Source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destinationList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destinationList) {
        return;
      }

      // Check if cards exists on the source list
      if (!sourceList.cards) {
        sourceList.cards = [];
      }
      // Check if cards exists on the destination list
      if (!destinationList.cards) {
        destinationList.cards = [];
      }

      // Moving the card in same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );
        reorderedCards.forEach((card, idx) => {
          card.order = idx + 1;
        });

        sourceList.cards = reorderedCards;
        setOrderedData(newOrderedData);
        // TODO: Trigger server action
        // User moves the card to another list
      } else {
        // Remove card from source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        // Add card to the destination list
        destinationList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, idx) => {
          card.order = idx + 1;
        });

        // Update order in the destination list
        destinationList.cards.forEach((card, idx) => {
          card.order = idx + 1;
        });

        setOrderedData(newOrderedData);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
