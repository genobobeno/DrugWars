import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { HighScore, fetchHighScores } from '../../lib/api';
import { Loader2, Crown, Award, Medal } from 'lucide-react';
import { Badge } from '../ui/badge';

export default function HighScoreTable() {
  const [scores, setScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadHighScores() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchHighScores();
        setScores(data);
      } catch (err) {
        console.error('Failed to load high scores:', err);
        setError('Failed to load high scores. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    loadHighScores();
  }, []);
  
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  
  function getRankBadge(index: number) {
    switch (index) {
      case 0:
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-600/50">
            <Crown className="w-3 h-3 mr-1" /> 1st
          </Badge>
        );
      case 1:
        return (
          <Badge variant="outline" className="bg-gray-200/20 text-gray-500 border-gray-500/50">
            <Medal className="w-3 h-3 mr-1" /> 2nd
          </Badge>
        );
      case 2:
        return (
          <Badge variant="outline" className="bg-amber-600/10 text-amber-700 border-amber-700/50">
            <Award className="w-3 h-3 mr-1" /> 3rd
          </Badge>
        );
      default:
        return <Badge variant="outline">{index + 1}</Badge>;
    }
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>High Scores</CardTitle>
        <CardDescription>The most successful drug empires in NYC</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-52">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 p-4 rounded text-center text-destructive text-sm">
            {error}
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            No high scores yet. Be the first!
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Days</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scores.map((score, index) => (
                  <TableRow key={score.id}>
                    <TableCell>
                      {getRankBadge(index)}
                    </TableCell>
                    <TableCell className="font-medium truncate max-w-[120px] md:max-w-none">
                      {score.playerName}
                    </TableCell>
                    <TableCell className="text-right">
                      ${score.finalScore.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {score.dayCompleted}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground hidden sm:table-cell">
                      {formatDate(score.dateCreated)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}