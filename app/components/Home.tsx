"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Neo4JUser } from "@/types";
import * as React from "react";
import TinderCard from "react-tinder-card";
import { neo4jSwipe } from "../neo4j.action";

interface HomepageClientComponentProps {
  currentUser: Neo4JUser;
  users: Neo4JUser[];
}

const HomepageClientComponent: React.FC<HomepageClientComponentProps> = ({
  currentUser,
  users,
}) => {
  const handleSwipe = async (direction: string, userId: string) => {
    const isMatch = await neo4jSwipe(
      currentUser.applicationId,
      direction,
      userId
    );
    if (isMatch) alert("congratulations you have a match");
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div>
        <div>
          <h1 className="text-4xl">
            Hello {currentUser.firstname} {currentUser.lastname}
          </h1>
        </div>
        <div className="mt-4 relative overflow-hidden">
          {users.map((user) => (
            <TinderCard
              onSwipe={(direction) =>
                handleSwipe(direction, user.applicationId)
              }
              className="absolute"
              key={user.applicationId}
              preventSwipe={["up", "down"]}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    {user.firstname} {user.lastname}{" "}
                  </CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
              </Card>
            </TinderCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomepageClientComponent;
