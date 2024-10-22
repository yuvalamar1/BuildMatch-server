# import pandas as pd
import random
import sys
import json
from collections import deque


class BipartiteGraph:
    def __init__(self, U, V, initial_matching=None):
        self.U = U  # Set of nodes on the right (plot)
        self.V = V  # Set of nodes on the left  (families)
        self.graph = {u: [] for u in U}  # Adjacency list to store the graph
        self.pairU = {u: None for u in U}  # Pairing for nodes in U
        self.pairV = {v: None for v in V}  # Pairing for nodes in V
        self.dist = {}  # Distance used in BFS

        # Initialize the matching with the given initialMatching
        if initial_matching:
            for u, v in initial_matching.items():
                self.pairU[u] = v
                self.pairV[v] = u

    # Add edge between node u in U and node v in V
    def add_edge(self, u, v):
        if u in self.graph:
            self.graph[u].append(v)

    def remove_edge(self,u,v):
        if u in self.graph:
            self.graph[u].remove(v)
            if self.pairU[u] == v and self.pairV[v] == u:
                self.pairU[u] = None
                self.pairV[v] = None

    # Perform BFS to find an augmenting path
    def bfs(self):
        queue = []
        for u in self.U:
            if self.pairU[u] is None:
                self.dist[u] = 0
                queue.append(u)
            else:
                self.dist[u] = float('inf')

        self.dist[None] = float('inf')

        while queue:
            u = queue.pop(0)
            if self.dist[u] < self.dist[None]:
                for v in self.graph[u]:
                    pair_v = self.pairV[v]
                    if self.dist[pair_v] == float('inf'):
                        self.dist[pair_v] = self.dist[u] + 1
                        queue.append(pair_v)

        return self.dist[None] != float('inf')

    # Perform DFS to find augmenting paths and update pairings
    def dfs(self, u):
        if u is not None:
            for v in self.graph[u]:
                pair_v = self.pairV[v]
                if self.dist[pair_v] == self.dist[u] + 1:
                    if self.dfs(pair_v):
                        self.pairV[v] = u
                        self.pairU[u] = v
                        return True
            self.dist[u] = float('inf')
            return False
        return True

    # run bfs to partition the nodes to E and O
    def bfs_parity(self, start_node):
        even_nodes = set()
        odd_nodes = set()
        queue = [(start_node, 0)]  # (node, level)
        visited = {start_node}
        while queue:
            current_node, level = queue.pop(0)
            if level % 2 == 0:
                even_nodes.add(current_node)
            else:
                odd_nodes.add(current_node)
            # Determine if current_node is a plot or a family
            if current_node in self.graph:
                # current_node is a plot, so its neighbors are families
                neighbors = self.graph[current_node]
                if level % 2 != 0:
                    neighbors = []
                    neighbors.append(self.pairU[current_node])
            else:
                # current_node is a family, so its neighbors are plots
                neighbors = [plot for plot, families in self.graph.items() if current_node in families]
                if level % 2 != 0:
                    neighbors = []
                    neighbors.append(self.pairV[current_node])

            for neighbor in neighbors:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, level + 1))

        return even_nodes, odd_nodes

    # Find the maximum matching considering the matching M
    def hopcroft_karp(self):
        matching = sum(1 for u in self.pairU if self.pairU[u] is not None)
        while self.bfs():
            for u in self.U:
                if self.pairU[u] is None:
                    if self.dfs(u):
                        matching += 1
        return matching

    def getV(self):
        return self.V

    def getU(self):
        return self.U


def runalgorithemondata(preferences, plots, manipulator=None):
    families = []
    initial_matching = {}
    invalid = set()
    E_i = set()
    O_i = set()
    U_i = set()

    # create list of families
    for i in range(len(preferences)):
        families.append(preferences[i][0])

    # create graph
    graph = BipartiteGraph(plots, families, initial_matching)

    # create r to determinate the max iteration
    r=0
    for pref in preferences:
        if len(pref[1])>r:
            r = len(pref[1])

    # run loop from 0 to r
    for i in range(r):
        # print(f"iteration : {i}")
        # add edges with weight i
        for prefernce in preferences:
            if (len(prefernce[1])>i and
                    (prefernce[0] not in invalid) and
                    (prefernce[1][i] not in invalid)):
                graph.add_edge(prefernce[1][i], prefernce[0])


        max_matching = graph.hopcroft_karp()
        E_i.clear()
        U_i.clear()
        O_i.clear()

        # divide into E and O using BFS search
        for family in families:
            if graph.pairV[family] is None:
                even_nodes, odd_nodes = graph.bfs_parity(family)
                E_i.update(even_nodes)
                O_i.update(odd_nodes)

        for plot in plots:
            if graph.pairU[plot] is None:
                even_nodes, odd_nodes = graph.bfs_parity(plot)
                E_i.update(even_nodes)
                O_i.update(odd_nodes)

        for node in families:
            if node not in E_i and node not in O_i:
                U_i.add(node)

        for node in plots:
            if node not in E_i and node not in O_i:
                U_i.add(node)

        invalid.update(U_i)
        invalid.update(O_i)

        if manipulator:
            if manipulator in invalid:
                return i

        if None not in graph.pairU.values():
            # create dict with number of pairings in each rank
            outputdata = json.dumps(graph.pairV)
            print(outputdata)
            return

    outputdata = json.dumps(graph.pairV)
    print(outputdata)
    return



# def readfile(filepath):
#     df = pd.read_excel(filepath,dtype=str)
#     # df = df.dropna()
#     plots = set()
#     preferences = [(row['family name'], [p for p in row[1:].tolist() if pd.notna(p)]) for _, row in df.iterrows()]
#     for _,plot in preferences:
#         plots.update(plot)
#     return preferences,plots


if __name__ == "__main__":
    # preferences, plots = readfile("סימולציה ראשונה קמה_1.xlsx")
    input_data = sys.stdin.read()
    input_data = json.loads(input_data)
    plots = set()
    # for _,plot in input_data:
    #     plots.update(plot)
    for plot in input_data:
        plots.update(plot[1])

    # Create the preferences list
    preferences = []

    for item in input_data:
        preferences.append((item[0], item[1]))

    runalgorithemondata(preferences,plots)

