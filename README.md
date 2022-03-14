# Bahmni on Kubernetes

## Setting Kubernetes cluster using Minikube (Development / Non-production)

1. Install [docker](https://docs.docker.com/engine/install/)
2. Install [minikube](https://minikube.sigs.k8s.io/docs/start/) >=1.25.2
3. Increase resources of your docker to a memory of atleast 8GB.
   ([Mac](https://docs.docker.com/desktop/mac/) /
   [Windows](https://docs.docker.com/desktop/windows/))

Note: You can also run minikube without using docker. Look
[here](https://minikube.sigs.k8s.io/docs/drivers/).

## Start minikube with decent resources

```
minikube start --driver=docker --memory 7000 --cpus=4
```

you should see

```
😄  minikube v1.25.2 on Darwin 10.15.7
✨  Using the docker driver based on user configuration
👍  Starting control plane node minikube in cluster minikube
🚜  Pulling base image ...
🔥  Creating docker container (CPUs=4, Memory=7000MB) ...\
```

## Enable Ingress

Ingress would act as a controller to route between various applicaitons

`minikube addons enable ingress`

## Add nginx ingress host entry to etc host

_MacOS / Linux_

```
sudo vi /etc/hosts

# bahmni kubernetes nginx-ingress
127.0.0.1 bahmni.k8s

# bahmni-odoo kubernetes nginx-ingress
127.0.0.1 erp-bahmni.k8s
```

_Windows_

```
    Press the Windows key.

    Type Notepad in the search field.

    In the search results, right-click Notepad and select Run as administrator.

    From Notepad, open the following file:

    c:\Windows\System32\Drivers\etc\hosts

    Make the necessary changes to the file.

    Select File > Save to save your changes.
```

## Run minikube tunnel in seperate terminal

minikube tunnel runs as a process, creating a network route on the host to the
service CIDR of the cluster using the cluster’s IP address as a gateway. The
tunnel command exposes the external IP directly to any program running on the
host operating system.

`sudo minikube tunnel --alsologtostderr -v=1`

Note: Run this in a seperate terminal and keep it open

## Provision All Bahmni Resources

```
kubectl apply -R -f .
```

## Provision Specific Resources

```
kubectl apply -R -f <directory_of_resource>/
```

Example:

```
kubectl apply -R -f openmrs/
kubectl apply -f bahmni-ingress.yaml
```

## View resources

```
 kubectl get all
```

## Delete all resources

```
kubectl delete -R -f .
```

## Accessing Application

Once the pods and servies are running you can access it from the browser on

1. Bahmni EMR --> https://bahmni.k8s/bahmni/home
2. OpenMRS --> https://bahmni.k8s/openmrs
3. OpenELIS --> https://bahmni.k8s/openelis
4. Odoo --> https://erp-bahmni.k8s/

### References:

1. [kubectl Commands cheatsheet](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands)
2. [Minikube Docs](https://minikube.sigs.k8s.io/docs/start/)
3. [NGINX Ingress](https://kubernetes.github.io/ingress-nginx/)
4. [Kubernetes API Config](https://kubernetes.io/docs/reference/kubernetes-api/)
