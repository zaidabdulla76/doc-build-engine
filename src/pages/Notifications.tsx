import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  TrendingUp,
  Users,
  Settings,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "alert",
      title: "Critical Risk Alert",
      message: "TechCorp Solutions credit rating dropped significantly",
      vendor: "TechCorp Solutions",
      timestamp: "5 minutes ago",
      read: false,
      priority: "critical"
    },
    {
      id: 2,
      type: "assessment",
      title: "Assessment Completed",
      message: "Enhanced due diligence for DataFlow Systems is ready for review",
      vendor: "DataFlow Systems",
      timestamp: "1 hour ago",
      read: false,
      priority: "high"
    },
    {
      id: 3,
      type: "document",
      title: "New Document Uploaded",
      message: "Financial statement uploaded for Global Logistics Ltd",
      vendor: "Global Logistics Ltd",
      timestamp: "3 hours ago",
      read: false,
      priority: "medium"
    },
    {
      id: 4,
      type: "workflow",
      title: "Approval Required",
      message: "SecureCloud Inc assessment awaiting your approval",
      vendor: "SecureCloud Inc",
      timestamp: "5 hours ago",
      read: true,
      priority: "high"
    },
    {
      id: 5,
      type: "system",
      title: "System Update",
      message: "New AI agents deployed for enhanced risk detection",
      vendor: null,
      timestamp: "1 day ago",
      read: true,
      priority: "low"
    },
    {
      id: 6,
      type: "alert",
      title: "Compliance Issue Detected",
      message: "CloudBase Technologies missing required certification",
      vendor: "CloudBase Technologies",
      timestamp: "2 days ago",
      read: true,
      priority: "high"
    }
  ]);

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast({
      title: "Marked as Read",
      description: "Notification has been marked as read"
    });
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast({
      title: "Notification Deleted",
      description: "Notification has been removed"
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast({
      title: "All Notifications Read",
      description: "All notifications have been marked as read"
    });
  };

  const handleClearAll = () => {
    setNotifications(notifications.filter(n => !n.read));
    toast({
      title: "Cleared Read Notifications",
      description: "All read notifications have been removed"
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert": return AlertTriangle;
      case "assessment": return FileText;
      case "document": return FileText;
      case "workflow": return CheckCircle2;
      case "system": return Settings;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-destructive/10 text-destructive border-destructive/20";
      case "high": return "bg-warning/10 text-warning border-warning/20";
      case "medium": return "bg-accent/10 text-accent border-accent/20";
      case "low": return "bg-success/10 text-success border-success/20";
      default: return "bg-secondary/10 text-secondary border-secondary/20";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const allNotifications = notifications;
  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const NotificationCard = ({ notification }: { notification: typeof notifications[0] }) => {
    const Icon = getNotificationIcon(notification.type);
    
    return (
      <div 
        className={`border rounded-lg p-4 hover:bg-secondary/30 transition-colors ${
          notification.read ? 'border-border bg-secondary/10' : 'border-primary/30 bg-card'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
              notification.read ? 'bg-secondary' : 'bg-primary/10'
            }`}>
              <Icon className={`h-5 w-5 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className={`font-semibold ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {notification.title}
                </h4>
                <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                  {notification.priority}
                </Badge>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
              <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                <span>{notification.timestamp}</span>
                {notification.vendor && (
                  <>
                    <span>•</span>
                    <span>{notification.vendor}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {!notification.read && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleDelete(notification.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-2">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleClearAll}>
              Clear Read
            </Button>
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              Mark All as Read
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total</span>
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">{notifications.length}</div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Unread</span>
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div className="text-3xl font-bold text-foreground">{unreadCount}</div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Critical</span>
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="text-3xl font-bold text-foreground">
              {notifications.filter(n => n.priority === 'critical').length}
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">This Week</span>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div className="text-3xl font-bold text-foreground">
              {notifications.filter(n => !n.timestamp.includes('day')).length}
            </div>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="all">
              All ({allNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="read">
              Read ({readNotifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {allNotifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="unread">
            <div className="space-y-4">
              {unreadNotifications.length > 0 ? (
                unreadNotifications.map(notification => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))
              ) : (
                <Card className="bg-card border-border p-12 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-success" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">You have no unread notifications</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="read">
            <div className="space-y-4">
              {readNotifications.length > 0 ? (
                readNotifications.map(notification => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))
              ) : (
                <Card className="bg-card border-border p-12 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Read Notifications</h3>
                  <p className="text-muted-foreground">Read notifications will appear here</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Notifications;